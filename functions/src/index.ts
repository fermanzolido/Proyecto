// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

/**
 * Triggered when a new dealership is created.
 * Creates a corresponding folder in Cloud Storage.
 */
export const onDealershipCreate = functions.firestore
  .document("dealerships/{dealershipId}")
  .onCreate(async (snap, context) => {
    const dealershipId = context.params.dealershipId;
    const bucket = storage.bucket();
    const folderPath = `dealership_documents/${dealershipId}/`;

    // Create a placeholder file to ensure the folder is created
    const file = bucket.file(`${folderPath}placeholder.txt`);
    
    try {
      await file.save(`Folder for dealership ${dealershipId}`);
      functions.logger.log(`Successfully created folder for dealership ${dealershipId}`);
    } catch (error) {
      functions.logger.error(`Failed to create folder for dealership ${dealershipId}`, error);
    }
  });

/**
 * Triggered when a vehicle's status is updated.
 * If status changes to 'delivered', it finds the corresponding B2B sales order,
 * updates its status to 'fulfilled', and creates a mock invoice.
 */
export const onVehicleDelivered = functions.firestore
  .document("vehicles/{vin}")
  .onUpdate(async (change, context) => {
    const vehicleDataAfter = change.after.data();
    const vehicleDataBefore = change.before.data();
    const vin = context.params.vin;

    // Check if the status was changed to 'delivered'
    if (vehicleDataAfter.status !== 'delivered' || vehicleDataBefore.status === 'delivered') {
      return null; // Not the change we are interested in
    }

    const dealershipId = vehicleDataAfter.dealershipId;
    if (!dealershipId) {
      functions.logger.log(`Vehicle ${vin} has no dealershipId, cannot process invoice.`);
      return null;
    }

    // Find the B2B sales order that contains this VIN
    const ordersQuery = db.collection("salesOrders_B2B")
      .where("dealershipId", "==", dealershipId)
      .where("vehicleVINs", "array-contains", vin)
      .where("status", "==", "pending");

    const ordersSnapshot = await ordersQuery.get();

    if (ordersSnapshot.empty) {
      functions.logger.log(`No pending B2B order found for VIN ${vin}`);
      return null;
    }

    // Assuming one VIN belongs to only one pending order at a time
    const orderDoc = ordersSnapshot.docs[0];

    // Create a mock invoice
    const invoice = {
      orderId: orderDoc.id,
      dealershipId: dealershipId,
      vin: vin,
      amount: vehicleDataAfter.invoicePrice, // Use the invoice price from the vehicle doc
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const invoiceRef = await db.collection("invoices").add(invoice);

    // Update the sales order
    await orderDoc.ref.update({
      status: "fulfilled",
      invoiceId: invoiceRef.id,
    });

    functions.logger.log(`Processed delivery for VIN ${vin}, created invoice ${invoiceRef.id} and updated order ${orderDoc.id}`);
    return null;
  });

/**
 * Scheduled function to calculate and aggregate analytics data.
 * Runs every 24 hours.
 */
export const calculateAnalytics = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  functions.logger.info("Starting analytics calculation...");

  const vehiclesSnapshot = await db.collection("vehicles").get();
  const dealershipsSnapshot = await db.collection("dealerships").get();
  const customersSnapshot = await db.collection("customers").get();

  const allVehicles = vehiclesSnapshot.docs.map(doc => ({ vin: doc.id, ...doc.data() }));
  const allDealerships = dealershipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const allCustomers = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // --- Manufacturer Analytics ---
  let totalNetworkInventory = allVehicles.length;
  let totalSoldVehicles = allVehicles.filter(v => v.status === 'sold').length;
  let inventoryTurnoverRate = totalNetworkInventory > 0 ? (totalSoldVehicles / totalNetworkInventory) : 0;
  
  // Static forecast for now
  const salesForecast = 1000; 
  let actualSales = allCustomers.length; // Assuming each customer represents a sale

  const salesByRegion: { [key: string]: number } = {};
  allCustomers.forEach(customer => {
    const dealership = allDealerships.find(d => d.id === customer.dealershipId);
    if (dealership) {
      salesByRegion[dealership.region] = (salesByRegion[dealership.region] || 0) + 1;
    }
  });

  const manufacturerAnalytics = {
    totalNetworkInventory,
    inventoryTurnoverRate,
    salesVsForecast: {
      actual: actualSales,
      forecast: salesForecast,
    },
    salesByRegion,
  };

  await db.collection("analytics_summary").doc("manufacturer").set({
    data: manufacturerAnalytics,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
  functions.logger.info("Manufacturer analytics calculated and saved.");

  // --- Dealership Analytics ---
  for (const dealership of allDealerships) {
    const dealershipVehicles = allVehicles.filter(v => v.dealershipId === dealership.id);
    const dealershipCustomers = allCustomers.filter(c => c.dealershipId === dealership.id);

    const monthlySales: { [key: string]: number } = {};
    dealershipCustomers.forEach(customer => {
      // Assuming saleDate is a Firestore Timestamp
      const date = (customer.saleDate as admin.firestore.Timestamp).toDate();
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlySales[monthKey] = (monthlySales[monthKey] || 0) + 1;
    });

    const turnoverByModel: { [key: string]: number } = {};
    dealershipCustomers.forEach(customer => {
      const soldVehicle = allVehicles.find(v => v.vin === customer.vehicleVIN);
      if (soldVehicle) {
        turnoverByModel[soldVehicle.model] = (turnoverByModel[soldVehicle.model] || 0) + 1;
      }
    });

    // Calculate regional average for comparison
    let regionalAverage = 0;
    const dealershipsInRegion = allDealerships.filter(d => d.region === dealership.region);
    if (dealershipsInRegion.length > 0) {
      const totalSalesInRegion = allCustomers.filter(c => {
        const customerDealership = allDealerships.find(d => d.id === c.dealershipId);
        return customerDealership && customerDealership.region === dealership.region;
      }).length;
      regionalAverage = totalSalesInRegion / dealershipsInRegion.length;
    }

    const dealershipAnalytics = {
      monthlySales,
      turnoverByModel,
      regionalAverageComparison: {
        dealershipSales: dealershipCustomers.length,
        regionalAverage: regionalAverage,
      },
    };

    await db.collection("analytics_summary").doc(dealership.id).set({
      data: dealershipAnalytics,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });
    functions.logger.info(`Dealership analytics for ${dealership.name} calculated and saved.`);
  }

  functions.logger.info("Analytics calculation complete.");
  return null;
});

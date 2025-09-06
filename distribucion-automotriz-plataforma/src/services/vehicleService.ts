// src/services/vehicleService.ts
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { Vehicle } from '../models/vehicle';

const vehiclesCollection = collection(db, 'vehicles');

// GET all vehicles (for manufacturer view)
export const getVehicles = async (): Promise<Vehicle[]> => {
  const snapshot = await getDocs(vehiclesCollection);
  return snapshot.docs.map(doc => ({ vin: doc.id, ...doc.data() } as Vehicle));
};

// GET vehicles for a specific dealership
export const getVehiclesByDealership = async (dealershipId: string): Promise<Vehicle[]> => {
  const q = query(vehiclesCollection, where("dealershipId", "==", dealershipId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ vin: doc.id, ...doc.data() } as Vehicle));
};

// GET available vehicles for a specific dealership
export const getAvailableVehiclesByDealership = async (dealershipId: string): Promise<Vehicle[]> => {
  const q = query(
    vehiclesCollection, 
    where("dealershipId", "==", dealershipId),
    where("status", "==", "available")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ vin: doc.id, ...doc.data() } as Vehicle));
};

// GET a single vehicle by VIN
export const getVehicleByVIN = async (vin: string): Promise<Vehicle | null> => {
  const docRef = doc(db, 'vehicles', vin);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { vin: docSnap.id, ...docSnap.data() } as Vehicle;
  }
  return null;
};

// UPDATE a vehicle's data
export const updateVehicle = async (vin: string, data: Partial<Vehicle>) => {
  const docRef = doc(db, 'vehicles', vin);
  return await updateDoc(docRef, data);
};

// Assign a vehicle to a dealership
export const assignVehicleToDealership = async (vin: string, dealershipId: string) => {
  return await updateVehicle(vin, { dealershipId });
};

// Mark a vehicle as sold
export const sellVehicle = async (vin: string, customerId: string) => {
  return await updateVehicle(vin, { 
    status: 'sold', 
    soldToCustomerId: customerId 
  });
};

// src/services/salesOrderService.ts
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { SalesOrderB2B } from '../models/salesOrderB2B';

const ordersCollection = collection(db, 'salesOrders_B2B');

// Create a new B2B sales order
export const createSalesOrder = async (orderData: Omit<SalesOrderB2B, 'id' | 'orderDate' | 'invoiceId' | 'status'>) => {
  const newOrder: Omit<SalesOrderB2B, 'id'> = {
    ...orderData,
    orderDate: serverTimestamp(),
    invoiceId: null,
    status: 'pending'
  };
  return await addDoc(ordersCollection, newOrder);
};

// Get all sales orders for a specific dealership
export const getSalesOrdersByDealership = async (dealershipId: string): Promise<SalesOrderB2B[]> => {
  const q = query(ordersCollection, where("dealershipId", "==", dealershipId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SalesOrderB2B));
};

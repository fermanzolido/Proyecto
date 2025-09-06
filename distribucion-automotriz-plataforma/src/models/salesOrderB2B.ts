// src/models/salesOrderB2B.ts

export type OrderStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface SalesOrderB2B {
  id?: string; // Firestore document ID
  dealershipId: string;
  vehicleVINs: string[];
  orderDate: any; // Firestore Timestamp
  invoiceId: string | null;
  status: OrderStatus;
}

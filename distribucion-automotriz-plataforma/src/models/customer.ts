// src/models/customer.ts

export interface Customer {
  id?: string; // Firestore document ID
  dealershipId: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  saleDate: any; // Firestore Timestamp
  vehicleVIN: string;
  finalPrice: number;
}

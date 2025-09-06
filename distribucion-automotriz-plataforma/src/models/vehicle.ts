// src/models/vehicle.ts

export type VehicleStatus = 'in_production' | 'available' | 'sold' | 'delivered';

export interface Vehicle {
  vin: string; // Document ID is the VIN
  model: string;
  trim: string;
  color: string;
  options: string[];
  status: VehicleStatus;
  dealershipId: string | null; // Null if not assigned to a dealership
  listPrice: number;
  invoicePrice: number;
  soldToCustomerId: string | null;
  createdAt: any; // Firestore Timestamp
}

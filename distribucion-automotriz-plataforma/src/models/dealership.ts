// src/models/dealership.ts

export interface Dealership {
  id?: string; // Firestore document ID
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  creditLine: number;
  region: string;
}

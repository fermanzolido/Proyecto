// src/services/customerService.ts
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Customer } from '../models/customer';

const customersCollection = collection(db, 'customers');

// ADD a new customer
export const addCustomer = async (customer: Omit<Customer, 'id'>) => {
  return await addDoc(customersCollection, customer);
};

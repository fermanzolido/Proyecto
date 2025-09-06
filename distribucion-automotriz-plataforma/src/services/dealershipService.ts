// src/services/dealershipService.ts
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { Dealership } from '../models/dealership';

const dealershipsCollection = collection(db, 'dealerships');

// GET all dealerships
export const getDealerships = async (): Promise<Dealership[]> => {
  const snapshot = await getDocs(dealershipsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dealership));
};

// GET a single dealership by ID
export const getDealership = async (id: string): Promise<Dealership | null> => {
  const docRef = doc(db, 'dealerships', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Dealership;
  }
  return null;
};

// ADD a new dealership
export const addDealership = async (dealership: Omit<Dealership, 'id'>) => {
  return await addDoc(dealershipsCollection, dealership);
};

// UPDATE a dealership
export const updateDealership = async (id: string, dealership: Partial<Dealership>) => {
  const docRef = doc(db, 'dealerships', id);
  return await updateDoc(docRef, dealership);
};

// DELETE a dealership
export const deleteDealership = async (id: string) => {
  const docRef = doc(db, 'dealerships', id);
  return await deleteDoc(docRef);
};

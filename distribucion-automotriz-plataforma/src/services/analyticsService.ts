// src/services/analyticsService.ts
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AnalyticsSummary, ManufacturerAnalytics, DealershipAnalytics } from '../models/analytics';

const analyticsCollection = 'analytics_summary';

// Get the aggregated analytics for the manufacturer
export const getManufacturerAnalytics = async (): Promise<ManufacturerAnalytics | null> => {
  const docRef = doc(db, analyticsCollection, 'manufacturer');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().data as ManufacturerAnalytics;
  }
  return null;
};

// Get the aggregated analytics for a specific dealership
export const getDealershipAnalytics = async (dealershipId: string): Promise<DealershipAnalytics | null> => {
  const docRef = doc(db, analyticsCollection, dealershipId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().data as DealershipAnalytics;
  }
  return null;
};

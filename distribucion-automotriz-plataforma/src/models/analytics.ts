// src/models/analytics.ts

// Data for the manufacturer's dashboard
export interface ManufacturerAnalytics {
  totalNetworkInventory: number;
  inventoryTurnoverRate: number; // (Sold Vehicles / Total Vehicles) over a period
  salesVsForecast: {
    actual: number;
    forecast: number;
  };
  salesByRegion: {
    [region: string]: number; // e.g., { "North": 120, "South": 200 }
  };
}

// Data for the dealership's dashboard
export interface DealershipAnalytics {
  monthlySales: {
    [month: string]: number; // e.g., { "2025-01": 10, "2025-02": 15 }
  };
  turnoverByModel: {
    [model: string]: number; // e.g., { "SedanX": 5, "SUVY": 8 }
  };
  regionalAverageComparison: {
    dealershipSales: number;
    regionalAverage: number;
  };
}

// The document stored in the analytics_summary collection
export interface AnalyticsSummary {
  id?: 'manufacturer' | string; // 'manufacturer' for global, dealershipId for specific
  data: ManufacturerAnalytics | DealershipAnalytics;
  lastUpdated: any; // Firestore Timestamp
}

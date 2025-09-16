// API Response Types
export interface PreMulticlassResponse {
  pred_class: 'CLASS I' | 'CLASS II' | 'CLASS III';
  probabilities: {
    'CLASS I': number;
    'CLASS II': number;
    'CLASS III': number;
  };
  confidence_level: number;
  computed_history_present: boolean;
}

export interface PostBinaryResponse {
  score: number;
  pred_high_risk: 0 | 1;
  confidence_level: number;
}

export interface StatusSummaryResponse {
  statusCounts: {
    [key: string]: number;
  };
  top5Events: Array<{
    id: string;
    action: string;
    status: string;
    date: string;
  }>;
  manufacturers: Array<{
    name: string;
    eventCount: number;
  }>;
}

// Form Data Types
export interface PreMulticlassFormData {
  deviceName: string;
  manufacturerName: string;
  riskClass: 'I' | 'II' | 'III' | 'other';
  classification: string;
  implanted: boolean;
  quantityInCommerce: number;
  country: string;
  parentCompany: string;
}

export interface PostBinaryFormData {
  reason: string;
  action: string;
  actionSummary: string;
}

export interface StatusSummaryFormData {
  country: string;
  deviceName: string;
}
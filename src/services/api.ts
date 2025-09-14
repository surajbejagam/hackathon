import { API_CONFIG, buildApiUrl, getApiHeaders, FEATURE_FLAGS } from '../config/api';
import type { 
  PreMulticlassFormData, 
  PreMulticlassResponse,
  PostBinaryFormData,
  PostBinaryResponse,
  StatusSummaryFormData,
  StatusSummaryResponse
} from '../types';

// Generic API call function
async function apiCall<T>(endpoint: string, data?: any): Promise<T> {
  if (FEATURE_FLAGS.enableMockData) {
    // Return mock data when in development mode
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockResponse<T>(endpoint, data));
      }, 1500 + Math.random() * 1000);
    });
  }

  const url = buildApiUrl(endpoint);
  const headers = getApiHeaders();

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Mock data generators for development
function generateMockResponse<T>(endpoint: string, data?: any): T {
  switch (endpoint) {
    case API_CONFIG.endpoints.preMulticlass:
      return generateMockPreMulticlassResponse(data) as T;
    case API_CONFIG.endpoints.postBinary:
      return generateMockPostBinaryResponse(data) as T;
    case API_CONFIG.endpoints.statusSummary:
      return generateMockStatusSummaryResponse(data) as T;
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}

function generateMockPreMulticlassResponse(data: PreMulticlassFormData): PreMulticlassResponse {
  const riskClass = data.riskClass === 'I' ? 'CLASS I' : data.riskClass === 'II' ? 'CLASS II' : 'CLASS III';
  
  const probabilities = {
    'CLASS I': Math.random() * 0.4 + 0.1,
    'CLASS II': Math.random() * 0.4 + 0.1,
    'CLASS III': Math.random() * 0.4 + 0.1
  };
  
  // Normalize probabilities
  const total = Object.values(probabilities).reduce((sum, val) => sum + val, 0);
  Object.keys(probabilities).forEach(key => {
    probabilities[key as keyof typeof probabilities] /= total;
  });

  return {
    pred_class: riskClass,
    probabilities,
    confidence_level: Math.random() * 0.3 + 0.7,
    computed_history_present: Math.random() > 0.5
  };
}

function generateMockPostBinaryResponse(data: PostBinaryFormData): PostBinaryResponse {
  return {
    score: Math.random(),
    pred_high_risk: Math.random() > 0.5 ? 1 : 0,
    confidence_level: Math.random() * 0.3 + 0.7
  };
}

function generateMockStatusSummaryResponse(data: StatusSummaryFormData): StatusSummaryResponse {
  return {
    statusCounts: {
      'Terminated': Math.floor(Math.random() * 50) + 10,
      'Completed': Math.floor(Math.random() * 100) + 20,
      'Open, Classified': Math.floor(Math.random() * 30) + 5,
      'Under Investigation': Math.floor(Math.random() * 20) + 2
    },
    top5Events: [
      { id: 'E001', action: 'Device recall due to software malfunction', status: 'Completed', date: '2024-01-15' },
      { id: 'E002', action: 'Safety notification for battery replacement', status: 'Open, Classified', date: '2024-01-10' },
      { id: 'E003', action: 'Investigation of overheating reports', status: 'Under Investigation', date: '2024-01-08' },
      { id: 'E004', action: 'Corrective action for manufacturing defect', status: 'Completed', date: '2024-01-05' },
      { id: 'E005', action: 'Field safety notice for calibration issue', status: 'Terminated', date: '2024-01-02' }
    ],
    manufacturers: [
      { name: 'Acme Medical', eventCount: Math.floor(Math.random() * 50) + 10 },
      { name: 'TechCorp Health', eventCount: Math.floor(Math.random() * 40) + 8 },
      { name: 'MedDevice Inc', eventCount: Math.floor(Math.random() * 35) + 6 },
      { name: 'Global Healthcare', eventCount: Math.floor(Math.random() * 30) + 4 },
      { name: 'Precision Med', eventCount: Math.floor(Math.random() * 25) + 3 }
    ]
  };
}

// API service functions
export const apiService = {
  async predictPreMulticlass(data: PreMulticlassFormData): Promise<PreMulticlassResponse> {
    return apiCall<PreMulticlassResponse>(API_CONFIG.endpoints.preMulticlass, data);
  },

  async predictPostBinary(data: PostBinaryFormData): Promise<PostBinaryResponse> {
    return apiCall<PostBinaryResponse>(API_CONFIG.endpoints.postBinary, data);
  },

  async getStatusSummary(data: StatusSummaryFormData): Promise<StatusSummaryResponse> {
    return apiCall<StatusSummaryResponse>(API_CONFIG.endpoints.statusSummary, data);
  }
};
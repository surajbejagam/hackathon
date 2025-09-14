// API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.meddevice-intelligence.com',
  version: import.meta.env.VITE_API_VERSION || 'v1',
  endpoints: {
    preMulticlass: import.meta.env.VITE_PRE_MULTICLASS_ENDPOINT || '/api/predict/pre-multiclass',
    postBinary: import.meta.env.VITE_POST_BINARY_ENDPOINT || '/api/predict/post-binary',
    statusSummary: import.meta.env.VITE_STATUS_SUMMARY_ENDPOINT || '/api/status-summary'
  },
  auth: {
    apiKey: import.meta.env.VITE_API_KEY,
    apiSecret: import.meta.env.VITE_API_SECRET
  }
};

// Application Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'MedDevice Intelligence',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'AI-Powered Medical Device Safety Analytics'
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
};

// UI Configuration
export const UI_CONFIG = {
  defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'light',
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  chartAnimationDuration: parseInt(import.meta.env.VITE_CHART_ANIMATION_DURATION || '1000')
};

// Cache Configuration
export const CACHE_CONFIG = {
  duration: parseInt(import.meta.env.VITE_CACHE_DURATION || '300000'),
  enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true'
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}/${API_CONFIG.version}${endpoint}`;
};

// Helper function to get API headers
export const getApiHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (API_CONFIG.auth.apiKey) {
    headers['X-API-Key'] = API_CONFIG.auth.apiKey;
  }

  if (API_CONFIG.auth.apiSecret) {
    headers['X-API-Secret'] = API_CONFIG.auth.apiSecret;
  }

  return headers;
};
import { videoPackages, upsellOptions, upsellOptionMap } from '../stripe-config';

// Re-define apiClient if not imported (use the same logic as in AuthContext)
const API_URL = 'http://localhost:5001/api';
const apiClient = {
  async request(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `${response.status} ${response.statusText}`);
      }
      return data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  },
  get: (endpoint: string) => apiClient.request(endpoint, 'GET'),
  post: (endpoint: string, body: any) => apiClient.request(endpoint, 'POST', body),
  put: (endpoint: string, body: any) => apiClient.request(endpoint, 'PUT', body),
  delete: (endpoint: string) => apiClient.request(endpoint, 'DELETE'),
};
// End apiClient re-definition

// Create a checkout session for a package
export const createCheckoutSession = async (
  orderId: string,
  packageType: string,
  selectedOptions: string[] = [],
  additionalFormats: number = 0
) => {
  try {
    const packageKey = packageType
    const baseAmount = videoPackages[packageKey]?.price;
    console.log({packageType, baseAmount})
    if (baseAmount === undefined) {
      throw new Error('Invalid package type specified');
    }
    if (!orderId) {
      throw new Error('Order ID must be provided to create a checkout session');
    }

    // Calculate total amount based on package, options, and formats
    let totalAmount = baseAmount;
    selectedOptions.forEach(optionId => {
      const mappedId = upsellOptionMap[optionId];
      totalAmount += upsellOptions[mappedId]?.price || 0;
    });
    totalAmount += additionalFormats * 5; // Add cost for additional formats

    // Create a checkout session directly via backend API
    const sessionData = await apiClient.post('/payments/create-checkout-session', {
        orderId: orderId,         // Pass the existing order ID
        amount: totalAmount,      // Pass the calculated total amount
        currency: 'chf',         // Assuming currency is CHF
        description: `${videoPackages[packageKey]?.name || packageType} Video Package` // Adjust description as needed
        // Add selectedOptions, additionalFormats to metadata if needed by backend/webhook
    });

    // Backend returns { id: sessionId, url: sessionUrl }
    return { 
      sessionId: sessionData.id,
      url: sessionData.url
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    // Try to pass specific backend error message
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    throw new Error(message);
  }
};

// Helper function to get package amount
export const getPackageAmount = (packageType: 'Spark' | 'Flash' | 'Ultra'): number => {
  const packageKey = packageType
  return videoPackages[packageKey]?.price || 0;
};

// Helper function to get upsell option amount
export const getUpsellAmount = (optionId: string): number => {
  const mappedId = upsellOptionMap[optionId];
  return upsellOptions[mappedId]?.price || 0;
};
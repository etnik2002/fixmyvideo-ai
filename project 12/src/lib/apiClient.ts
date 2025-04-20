// Define API base URL (consider moving to .env)
const API_URL = 'http://localhost:5001/api'; // Use relative path for same-origin requests

// Helper function to handle API requests
async function request(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) {
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

    // Try to parse JSON, but handle cases where the response might be empty or not JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
       // Handle potential empty body for 204 No Content or similar
       if (response.status !== 204) { 
         try {
            data = await response.json();
         } catch (jsonError) {
             console.error("Failed to parse JSON response:", jsonError);
             // Optionally throw a more specific error or return a specific value
             throw new Error("Invalid JSON received from server."); 
         }
       } else {
         data = null; // Or undefined, depending on how you want to handle 204
       }
    } else {
      // Handle non-JSON responses if necessary, or just ignore the body
       console.log("Received non-JSON response");
       // data = await response.text(); // Example: get text if not JSON
    }

    if (!response.ok) {
      // Use message from backend JSON response if available, otherwise use status text
      const errorMessage = data?.message || response.statusText || `HTTP error ${response.status}`;
      throw new Error(errorMessage);
    }
    
    // Return data if it exists, otherwise the response itself might be useful
    return data;

  } catch (error) {
    console.error(`API Error (${method} ${API_URL}${endpoint}):`, error);
    // Consider more specific error handling or re-throwing strategy
    // Re-throw the error to be caught by the calling function
    throw error; 
  }
}

// Export specific methods as a named export
export const apiClient = {
  get: (endpoint: string) => request(endpoint, 'GET'),
  post: (endpoint: string, body: any) => request(endpoint, 'POST', body),
  put: (endpoint: string, body: any) => request(endpoint, 'PUT', body),
  delete: (endpoint: string) => request(endpoint, 'DELETE'),
}; 
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
// Removed Firebase imports
import toast from 'react-hot-toast';

// Define API base URL (consider moving to .env)
const API_URL = 'http://localhost:5001/api'; // Use relative path for same-origin requests

// --- Interfaces ---
// Simplified UserData based on backend User model (adjust as needed)
interface UserData {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  // Add other fields returned by your /api/auth/me or /api/auth/login routes
  createdAt?: string; // Assuming timestamps are returned as strings
  // photoURL?: string; // Add if your backend provides it
}

interface AuthContextType {
  currentUser: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // Added name parameter
  logout: () => void; // Made synchronous as it just clears local state/storage
  // --- Stubs for future implementation ---
  // resetPassword: (email: string) => Promise<void>;
  // updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  // updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: string | null;
  token: string | null; // Expose token for potential direct use (optional)
}

// --- Helper for API Calls ---
export const apiClient = {
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
        // Use message from backend response if available, otherwise use generic text
        throw new Error(data.message || `${response.status} ${response.statusText}`);
      }
      return data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error; // Re-throw the error to be caught by calling function
    }
  },

  get: (endpoint: string) => apiClient.request(endpoint, 'GET'),
  post: (endpoint: string, body: any) => apiClient.request(endpoint, 'POST', body),
  put: (endpoint: string, body: any) => apiClient.request(endpoint, 'PUT', body),
  delete: (endpoint: string) => apiClient.request(endpoint, 'DELETE'),
};


// --- Auth Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load user from token on initial mount
  useEffect(() => {
    const loadUserFromToken = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          // No need to explicitly set token for apiClient here,
          // it reads from localStorage on each request.
          const userData = await apiClient.get('/auth/me');
          setCurrentUser(userData);
          setIsAdmin(userData.role === 'admin');
          setToken(storedToken); // Ensure state matches localStorage
        } catch (err) {
          console.error("Failed to load user from token", err);
          localStorage.removeItem('authToken'); // Invalid token, remove it
          setToken(null);
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  // Register function
  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiClient.post('/auth/register', { name, email, password });
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setCurrentUser(data); // Backend should return user data upon registration
      setIsAdmin(data.role === 'admin');
      toast.success('Account successfully created!');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      // Re-throwing allows components to handle registration errors if needed
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array, doesn't depend on state/props

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setCurrentUser(data); // Backend should return user data upon login
      setIsAdmin(data.role === 'admin');
      toast.success('Successfully logged in!');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      // Re-throwing allows components to handle login errors if needed
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    setError(null); // Clear any previous errors
    toast.success('Successfully logged out');
    // No API call needed for basic JWT logout
  }, []); // Empty dependency array

  // --- Stubs ---
  // const resetPassword = async (email: string) => { /* TODO: Implement with backend */ };
  // const updateUserProfile = async (data: Partial<UserData>) => { /* TODO: Implement with backend */ };
  // const updateUserPassword = async (currentPassword: string, newPassword: string) => { /* TODO: Implement with backend */ };


  // --- Context Value ---
  const value: AuthContextType = {
    currentUser,
    isAdmin,
    loading,
    login,
    register,
    logout,
    // resetPassword, // Add when implemented
    // updateUserProfile, // Add when implemented
    // updateUserPassword, // Add when implemented
    error,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
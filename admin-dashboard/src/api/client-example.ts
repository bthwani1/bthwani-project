// Example: How to use the generated typed API client
// This file shows how to integrate the generated client into existing code

import { AuthApi, UserApi, apiCall, isApiError } from './generated';
import axios from 'axios';

// Configure axios instance with interceptors
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Initialize API clients
const authApi = new AuthApi(apiClient.defaults.baseURL);
const userApi = new UserApi(apiClient.defaults.baseURL);

// Example usage functions
export const authService = {
  // Login function using typed client
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await apiCall(() =>
        authApi.authControllerLogin(credentials)
      );
      return response.data;
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw error;
    }
  },

  // Get current user profile
  async getCurrentUser() {
    return apiCall(() => userApi.usersControllerMe());
  },

  // Update user profile
  async updateProfile(userData: any) {
    return apiCall(() => userApi.usersControllerUpdateMe(userData));
  }
};

export const walletService = {
  // Get wallet balance
  async getBalance() {
    return apiCall(() => userApi.walletControllerGetBalance());
  },

  // Get transactions
  async getTransactions(params?: { page?: number; limit?: number }) {
    return apiCall(() => userApi.walletControllerGetTransactions(params));
  }
};

// Export configured axios instance for custom requests
export { apiClient };

/*
Migration Guide:
1. Replace existing API calls with typed client methods
2. Use apiCall wrapper for consistent error handling
3. Use isApiError for type-safe error checking
4. All types are automatically inferred from OpenAPI spec

Example migration:
OLD:
const response = await axios.post('/auth/login', credentials);

NEW:
const response = await apiCall(() => authApi.authControllerLogin(credentials));
*/

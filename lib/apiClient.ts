import axios from 'axios';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://stuffed-happiness-hub.onrender.com/api'
).replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Read token from zustand persisted store
      try {
        const authStoreRaw = localStorage.getItem('auth-store');
        if (authStoreRaw) {
          const parsed = JSON.parse(authStoreRaw);
          const token = parsed?.state?.token;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error('Failed to parse auth-store from localStorage:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';

    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-store');
        // only redirect if not on auth pages
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;

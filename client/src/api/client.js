import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Determine the API base URL based on environment and current location.
const inferBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  
  if (typeof window === 'undefined') return '/api';

  const { hostname, port, protocol } = window.location;
  
  // On localhost (any port), use relative '/api' so CRA proxy handles it
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  }
  
  // On other IPs/domains, use direct backend URL
  // Assumes backend runs on same IP, port 5000
  const backendPort = process.env.REACT_APP_BACKEND_PORT || '5000';
  return `${protocol}//${hostname}:${backendPort}/api`;
};

const API_BASE_URL = inferBaseUrl();

console.log('API_BASE_URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      fullUrl: `${API_BASE_URL}${config.url}`
    });

    return config;
  },
  (error) => Promise.reject(error)
);

export { API_BASE_URL };
export default apiClient;

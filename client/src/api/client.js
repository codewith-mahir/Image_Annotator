import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Determine the API base URL based on environment and current location.
const inferBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  
  if (typeof window === 'undefined') return '/api';

  const { hostname, protocol } = window.location;
  
  // WORKAROUND: For now, always use direct backend URL
  // This bypasses CRA proxy issues
  // In production, you would check the environment and use appropriate URLs
  const backendHost = hostname === 'localhost' || hostname === '127.0.0.1' 
    ? 'localhost' 
    : hostname;
  const backendPort = process.env.REACT_APP_BACKEND_PORT || '5000';
  return `${protocol}//${backendHost}:${backendPort}/api`;
};

const API_BASE_URL = inferBaseUrl();

console.log('🔗 API_BASE_URL:', API_BASE_URL);

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

    console.log('📤 API Request:', {
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

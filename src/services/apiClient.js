import axios from 'axios';
import mockAdapter from '../mockApi/adapter';

// No backend is deployed yet — requests are served by the in-browser mock
// API (src/mockApi) instead of hitting the network. Remove the `adapter`
// line below once a real backend is connected.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://zeelinoverseas.onrender.com/v1',
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: mockAdapter,
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 — clear state AND redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');

      window.dispatchEvent(new CustomEvent('auth:unauthorized'));

      if (!error.config?.suppressAuthRedirect && window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

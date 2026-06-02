import axios from 'axios';

// Enlevez /api de l'URL de base puisque vos routes n'ont pas ce préfixe
const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(` ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(` API Error:`, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to debug the URL
axiosInstance.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
  console.log('Sending request to:', fullUrl);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to debug response errors
axiosInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('Request failed:', {
    url: error.config?.url,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });
  return Promise.reject(error);
});



export default axiosInstance;


import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5172/api', // Dostosuj port do swojego API
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
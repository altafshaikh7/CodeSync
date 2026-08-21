import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000 || https://codesync-ho9u.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Runs fresh on every request — always picks up the latest token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
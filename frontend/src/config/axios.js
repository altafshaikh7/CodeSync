import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://codesync-ne50.onrender.com';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // ✅ 30 second timeout
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // ✅ Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // ✅ Don't redirect if already on login/register
            const publicPaths = ['/login', '/register', '/forgot-password', '/'];
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = '/login';
            }
        }
        
        // ✅ Handle network errors
        if (error.code === 'ERR_NETWORK') {
            console.error('❌ Network error - please check your connection');
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
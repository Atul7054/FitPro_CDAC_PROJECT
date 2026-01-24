import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Make sure this matches your backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a Request Interceptor
// This automatically adds the "Authorization: Bearer <token>" header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('fitpro_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
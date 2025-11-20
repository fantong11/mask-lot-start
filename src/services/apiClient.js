import axios from 'axios';
import { message } from 'antd';

// Create Axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Default to local mock
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth tokens here
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    message.error('Unauthorized. Please login again.');
                    // Redirect to login if needed
                    break;
                case 403:
                    message.error('Access Denied.');
                    break;
                case 404:
                    message.error('Resource not found.');
                    break;
                case 500:
                    message.error('Server Error. Please try again later.');
                    break;
                default:
                    message.error(data.message || 'An unexpected error occurred.');
            }
        } else if (error.request) {
            message.error('Network Error. Please check your connection.');
        } else {
            message.error('Error setting up request.');
        }
        return Promise.reject(error);
    }
);

// Generic API Service
const ApiService = {
    get: (url, params = {}) => apiClient.get(url, { params }),
    post: (url, data = {}) => apiClient.post(url, data),
    put: (url, data = {}) => apiClient.put(url, data),
    delete: (url) => apiClient.delete(url),
};

export default ApiService;

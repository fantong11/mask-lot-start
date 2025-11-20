import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
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
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    (error: AxiosError) => {
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
                    message.error((data as any).message || 'An unexpected error occurred.');
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
    get: <T = any>(url: string, params: any = {}): Promise<T> => apiClient.get(url, { params }),
    post: <T = any>(url: string, data: any = {}): Promise<T> => apiClient.post(url, data),
    put: <T = any>(url: string, data: any = {}): Promise<T> => apiClient.put(url, data),
    delete: <T = any>(url: string): Promise<T> => apiClient.delete(url),
};

export default ApiService;

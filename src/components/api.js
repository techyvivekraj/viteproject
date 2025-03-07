import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
    
});
axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('auth_token');
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleError = (error) => {
    let errorMessage = 'An unknown error occurred.';
    
    if (error.response) {
        // Get the error message from response if available
        errorMessage = error.response.data?.message || 
                      error.response.data?.errors?.[0]?.msg ||
                      errorMessage;

        // Handle different status codes
        switch (error.response.status) {
            case 400:
                errorMessage = errorMessage || 'Invalid request. Please check your data.';
                break;
            case 401:
                errorMessage =  errorMessage ||'Unauthorized. Please log in.';
                localStorage.clear();
                window.location.href = '/login';
                break;
            case 403:
                errorMessage =  errorMessage ||'Your session has expired. Please log in again.';
                localStorage.clear();
                window.location.href = '/login';
                break;
            case 404:
                errorMessage = errorMessage || 'Resource not found.';
                break;
            case 409:
                errorMessage = errorMessage || 'Conflict with existing data.';
                break;
            case 422:
                errorMessage = errorMessage || 'Validation error. Please check your input.';
                break;
            case 429:
                errorMessage =  errorMessage ||'Too many requests. Please try again later.';
                break;
            case 500:
                errorMessage = 'Internal server error. Please try again later.';
                break;
            case 503:
                errorMessage = 'Service unavailable. Please try again later.';
                break;
            default:
                if (error.response.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
                break;
        }
    } else if (error.request) {
        errorMessage = 'No response received from the server. Please check your internet connection.';
    } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
    } else {
        errorMessage = error.message || errorMessage;
    }
    
    return errorMessage;
};
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return Promise.reject(error);
    }
);
export const showToast = (message) => {
    toast.success(message);
};
export const showError = (message) => {
    toast.error(message);
};
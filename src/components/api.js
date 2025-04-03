import axios from 'axios';
import { toast } from 'react-toastify';
import { rateLimiter } from '../utils/rateLimiter';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const API_URL = import.meta.env.VITE_API_URL;

const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: API_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    instance.interceptors.request.use(async (config) => {
        // Wait for a slot in the rate limiter
        await rateLimiter.waitForSlot();
        
        // Add auth token if exists
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log URL and parameters
        console.log('Request URL:', config.baseURL + config.url);
        console.log('Request Method:', config.method.toUpperCase());
        console.log('Request Parameters:', {
            params: config.params,  // URL parameters
            data: config.data,      // Request body
            headers: config.headers // Request headers
        });
        
        return config;
    });

    // Response interceptor with retry logic
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            
            // If it's a rate limit error and we haven't retried yet
            if (error.response?.status === 429 && !originalRequest._retry) {
                originalRequest._retry = true;
                
                // Retry the request after delay
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(instance(originalRequest));
                    }, RETRY_DELAY);
                });
            }
            
            // For other errors, retry up to MAX_RETRIES times
            if (!originalRequest._retryCount) {
                originalRequest._retryCount = 0;
            }
            
            if (originalRequest._retryCount < MAX_RETRIES) {
                originalRequest._retryCount++;
                
                // Exponential backoff
                const delay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(instance(originalRequest));
                    }, delay);
                });
            }
            
            const errorMessage = handleError(error);
            toast.error(errorMessage);
            return Promise.reject(error);
        }
    );

    return instance;
};

export const axiosInstance = createAxiosInstance();

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

export const showToast = (message) => {
    toast.success(message);
};

export const showError = (message) => {
    toast.error(message);
};
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
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.status === 403) {
            toast.error('Your session has expired. Please log in again.');
            localStorage.clear();
            window.location.href = '/login';
        }
    } else if (error.request) {
        errorMessage = 'No response received from the server.';
    } else {
        errorMessage = error.message;
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
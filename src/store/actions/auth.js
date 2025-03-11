import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Helper function for error handling
const handleError = (error) => {
    const errorMessage = error.response?.data?.errors?.[0]?.msg || error.message;
    return {
        message: errorMessage,
        statusCode: error.response?.status || 500,
        errors: error.response?.data?.errors || []
    };
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password, recaptchaToken }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', { 
                email, 
                password,
                recaptchaToken 
            });
            const { data } = response.data;

            // Store auth data
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('expiration_time', data.expiresIn);
            localStorage.setItem('uid', data.user.id);
            localStorage.setItem('orgId', data.user.organization_id);

            return {
                uid: data.user.id,
                email: data.user.email,
                role: data.user.role,
                organizationId: data.user.organization_id
            };
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ ownerName, email, mobile, password, organizationName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/register', {
                name: ownerName,
                email,
                password,
                organizationName,
                mobile
            });

            if (!response.data.success) {
                throw new Error(response.data.errors?.[0]?.msg || 'Registration failed');
            }

            const { data } = response.data;
            localStorage.setItem('uid', data.id);
            localStorage.setItem('orgId', data.organization_id);
            
            return data;
        } catch (error) {
            let errorMessage;
            if (error.response?.status === 409) {
                errorMessage = 'User already exists with this email.';
            } else {
                errorMessage = error.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
            }
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const validateUser = createAsyncThunk(
    'auth/validate',
    async (_, { rejectWithValue }) => {
        try {
            const uid = localStorage.getItem('uid');
            if (!uid) {
                throw new Error('No user ID found');
            }

            const response = await axiosInstance.post('/validateUser', { uid });
            if (!response.data || String(response.data.uid) !== String(uid)) {
                throw new Error('Invalid user session');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.clear();
            return null;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);
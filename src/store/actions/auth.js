import { axiosInstance,showError,showToast } from '../../components/api';
import {
    logout,
    setError,
    setLoading,
    setRegistered,
    setUser
} from '../slices/authSlice';

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axiosInstance.post('/auth/login', { email, password });
        
        // Check if the response was successful

        const { data } = response.data;
        // Store auth data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('expiration_time', data.expiresIn);
        localStorage.setItem('uid', data.user.id);
        localStorage.setItem('orgId', data.user.organization_id);
        
        // Update user state
        dispatch(setUser({
            uid: data.user.id,
            email: data.user.email,
            role: data.user.role,
            organizationId: data.user.organization_id
        }));

        showToast('Logged in successfully!');
    } catch (error) {
        // console.error('Login error:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const registerUser = (ownerName, email, mobile, password, organizationName,) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.post('/auth/register', {
            name: ownerName,
            email: email,
            password: password,
            organizationName: organizationName,
            organizationDomain: null // optional domain
        });

        if (!response.data.success) {
            throw new Error(response.data.errors?.[0]?.msg || 'Registration failed');
        }

        const { data } = response.data;
        dispatch(setRegistered(true));
        showToast('Registered successfully!', 'success');
        localStorage.setItem('uid', data.id);
        localStorage.setItem('orgId', data.organization_id);
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage;
        
        if (error.response) {
            if (error.response.status === 409) {
                errorMessage = 'User already exists with this email.';
            } else {
                errorMessage = error.response.data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
            }
        } else if (error.request) {
            errorMessage = 'No response from server. Please check your internet connection.';
        } else {
            errorMessage = error.message || 'An error occurred during registration';
        }
        
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
};

export const logoutUser = () => async (dispatch) => {
    try {
        localStorage.clear();
        dispatch(logout());
        showToast('Logged out successfully!');
    } catch (error) {
        dispatch(setError(error.message));
        
    }
};

export const listenToAuthChanges = () => async (dispatch) => {
    dispatch(setLoading(true));

    try {
        const uid = localStorage.getItem('uid');
        if (!uid) {
            dispatch(logoutUser());
            return;
        }

        const response = await axiosInstance.post('/validateUser', { 'uid': uid });

        if (!response.data || String(response.data.uid) !== String(uid)) {
            dispatch(logoutUser());
        }

    } catch (error) {
        dispatch(logoutUser());
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};
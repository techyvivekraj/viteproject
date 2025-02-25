import { axiosInstance,showToast } from '../../components/api';
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
        const response = await axiosInstance.post('/login', { email, password });
        const user = response.data;

    const expirationTime = user.expirationTime;
        localStorage.setItem('auth_token', user.token);
        localStorage.setItem('expiration_time', expirationTime);
        localStorage.setItem('uid', user.data.id);
        localStorage.setItem('orgId', user.data.orgId);
        dispatch(setUser({
            uid: user.data.id,
            email: user.data.email
        }));

        //store in cookies
    } catch (error) {
        console.log(error);
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const registerUser = (ownerName, email, mobile, password, organizationName,) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        // Make an API call to register the user
        const response = await axiosInstance.post('/register', {
            'ownerName': ownerName,
            'email': email,
            'mobile': mobile,
            'password': password,
            'orgName': organizationName,
            'orgEmail': email,
            'orgMobile': mobile,
        });

        const user = response.data;
        dispatch(setRegistered(true));
        showToast('Registered successfully! Verification email sent.');
        localStorage.setItem('uid', user.data.id);
        localStorage.setItem('orgId', user.data.orgId);
    } catch (error) {
        dispatch(setError(error.message));
        
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
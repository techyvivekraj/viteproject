import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Fetch Overtime records
export const fetchOvertime = createAsyncThunk(
    'overtime/fetchOvertime',
    async (organizationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/overtime?organizationId=${organizationId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch overtime records');
        }
    }
);

// Add Overtime record
export const addOvertime = createAsyncThunk(
    'overtime/addOvertime',
    async (overtimeData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/overtime', overtimeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add overtime record');
        }
    }
);

// Update Overtime record
export const updateOvertime = createAsyncThunk(
    'overtime/updateOvertime',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/overtime/${id}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update overtime record');
        }
    }
);

// Delete Overtime record
export const deleteOvertime = createAsyncThunk(
    'overtime/deleteOvertime',
    async ({ id, organizationId }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/overtime/${id}`, { data: { organizationId } });
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete overtime record');
        }
    }
);
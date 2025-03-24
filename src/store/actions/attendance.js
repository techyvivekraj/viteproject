import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Fetch Attendance List
export const fetchAttendance = createAsyncThunk(
    'attendance/fetchAttendance',
    async ({ organizationId, filters = {} }, { rejectWithValue }) => {
        try {
            // Format dates properly
            const formattedFilters = {
                ...filters,
                startDate: filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : undefined,
                endDate: filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : undefined
            };

            // Remove null/undefined/empty string values from params
            const params = Object.entries({
                organizationId,
                ...formattedFilters
            }).reduce((acc, [key, value]) => {
                if (value != null && value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await axiosInstance.get('/attendance', { params });
            
            // Check if response has the expected structure
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response format');
            }

            return response.data;
        } catch (error) {
            console.error('Fetch attendance error:', error);
            return rejectWithValue(error.response?.data || 'Failed to fetch attendance');
        }
    }
);

// Mark Check-in
export const markCheckIn = createAsyncThunk(
    'attendance/markCheckIn',
    async (data, { rejectWithValue }) => {
        try {
            const formData = {
                date: data.date.toISOString(),
                checkInTime: data.checkInTime.toISOString(),
                checkInLocation: data.checkInLocation,
                checkInPhoto: data.checkInPhoto
            };

            const response = await axiosInstance.post('/attendance/check-in', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to mark check-in');
        }
    }
);

// Mark Check-out
export const markCheckOut = createAsyncThunk(
    'attendance/markCheckOut',
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const formData = {
                checkOutTime: data.checkOutTime.toISOString(),
                checkOutLocation: data.checkOutLocation,
                checkOutPhoto: data.checkOutPhoto
            };

            const response = await axiosInstance.post(`/attendance/${id}/check-out`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to mark check-out');
        }
    }
);

// Update Attendance Approval Status
export const updateAttendanceApproval = createAsyncThunk(
    'attendance/updateApproval',
    async ({ id, status, rejectionReason }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/attendance/${id}/approval`, {
                status,
                rejectionReason
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update attendance status');
        }
    }
); 
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Fetch Attendance List
const fetchAttendance = createAsyncThunk(
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

            const response = await axiosInstance.get('/attendance/date-range', { params });
            
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

// Mark Attendance
const markAttendance = createAsyncThunk(
    'attendance/markAttendance',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/attendance', {
                employeeId: data.employeeId,
                date: data.date,
                checkInTime: data.checkInTime,
                checkOutTime: data.checkOutTime,
                status: data.status,
                remarks: data.remarks
            });
            
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response format');
            }

            return response.data;
        } catch (error) {
            console.error('Mark attendance error:', error);
            return rejectWithValue(error.response?.data || 'Failed to mark attendance');
        }
    }
);

// Edit Attendance
const editAttendance = createAsyncThunk(
    'attendance/editAttendance',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/attendance/${data.id}`, {
                checkInTime: data.checkInTime,
                checkOutTime: data.checkOutTime,
                status: data.status,
                remarks: data.remarks
            });
            
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response format');
            }

            return response.data;
        } catch (error) {
            console.error('Edit attendance error:', error);
            return rejectWithValue(error.response?.data || 'Failed to edit attendance');
        }
    }
);

// Update Approval Status
const updateAttendanceApproval = createAsyncThunk(
    'attendance/updateApproval',
    async ({ id, status, rejectionReason }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/attendance/${id}/approval`, {
                status,
                rejectionReason
            });
            
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response format');
            }

            return response.data;
        } catch (error) {
            console.error('Update approval error:', error);
            return rejectWithValue(error.response?.data || 'Failed to update approval status');
        }
    }
);

// Single export statement for all actions
export {
    fetchAttendance,
    markAttendance,
    editAttendance,
    updateAttendanceApproval
}; 
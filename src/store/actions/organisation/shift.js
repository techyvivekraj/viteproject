import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../components/api';

// Fetch Shifts
export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/shifts', {
        params: { organizationId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch shifts');
    }
  }
);

// Add Shift
export const addShifts = createAsyncThunk(
  'shifts/addShift',
  async (shiftData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/shifts', shiftData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add shift');
    }
  }
);

// Update Shift
export const updateShift = createAsyncThunk(
  'shifts/updateShift',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/shifts/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update shift');
    }
  }
);

// Delete Shift
export const deleteShift = createAsyncThunk(
  'shifts/deleteShift',
  async ({ shiftId,  }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/shifts/${shiftId}`);
      return { shiftId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete shift');
    }
  }
);

// Fetch Shift Assignments
export const fetchShiftAssignments = createAsyncThunk(
  'shifts/fetchAssignments',
  async ({ organizationId, departmentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/shifts/assignments', {
        params: { 
          organizationId,
          departmentId 
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch shift assignments');
    }
  }
);

// Assign Shift
export const assignShift = createAsyncThunk(
  'shifts/assignShift',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/shifts/assign', assignmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to assign shift');
    }
  }
); 
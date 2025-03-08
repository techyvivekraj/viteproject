import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../components/api';

// Fetch Designations
export const fetchDesignations = createAsyncThunk(
  'designations/fetchDesignations',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/roles', {
        params: { organizationId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch designations');
    }
  }
);

// Add Designation
export const addDesignation = createAsyncThunk(
  'designations/addDesignation',
  async (designationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/roles', designationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add designation');
    }
  }
);

// Update Designation
export const updateDesignation = createAsyncThunk(
  'designations/updateDesignation',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/roles/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update designation');
    }
  }
);

// Delete Designation
export const deleteDesignation = createAsyncThunk(
  'designations/deleteDesignation',
  async ({ id, organizationId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/roles/${id}`, { data: { organizationId } });
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete designation');
    }
  }
); 
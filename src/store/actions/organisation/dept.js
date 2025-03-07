import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../components/api';

// Fetch Departments
export const fetchDepartments = createAsyncThunk(
  'organisation/fetchDepartments',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/departments', {
        params: { organizationId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch departments');
    }
  }
);

// Add Department
export const addDepartment = createAsyncThunk(
  'organisation/addDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add department');
    }
  }
);

// Update Department
export const updateDepartment = createAsyncThunk(
  'organisation/updateDepartment',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/departments/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update department');
    }
  }
);

// Delete Department
export const deleteDepartments = createAsyncThunk(
  'organisation/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/departments/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete department');
    }
  }
);

// Fetch Organization Details
export const fetchOrganizationDetails = createAsyncThunk(
  'organisation/fetchDetails',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/organizations/${organizationId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch organization details');
    }
  }
);

// Update Organization Details
export const updateOrganizationDetails = createAsyncThunk(
  'organisation/updateDetails',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/organizations/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update organization details');
    }
  }
); 
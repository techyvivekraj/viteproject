import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../components/api';

// Fetch Roles
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/roles', {
        params: { organizationId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch roles');
    }
  }
);

// Add Role
export const addRoles = createAsyncThunk(
  'roles/addRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/roles', roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add role');
    }
  }
);

// Update Role
export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/roles/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update role');
    }
  }
);

// Delete Role
export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (roleId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/roles/${roleId}`);
      return { roleId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete role');
    }
  }
);

// Fetch Role Permissions
export const fetchRolePermissions = createAsyncThunk(
  'roles/fetchPermissions',
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/roles/${roleId}/permissions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch role permissions');
    }
  }
);

// Update Role Permissions
export const updateRolePermissions = createAsyncThunk(
  'roles/updatePermissions',
  async ({ roleId, permissions }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/roles/${roleId}/permissions`, { permissions });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update role permissions');
    }
  }
); 
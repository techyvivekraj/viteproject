import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Fetch Employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/employees', {
        organizationId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employees');
    }
  }
);

// Add Employee
export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/employees', {
        ...employeeData,
        organizationId: 1 // You might want to make this dynamic based on your needs
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add employee');
    }
  }
);

// Update Employee
export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/employees/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update employee');
    }
  }
);

// Delete Employee
export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employees/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete employee');
    }
  }
);

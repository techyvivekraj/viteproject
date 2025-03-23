import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Fetch Employees
export const fetchEmployees = createAsyncThunk(
    'organisation/fetchEmployees',
    async (organizationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/employees?organizationId=${organizationId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch employees');
        }
    }
);

// Add Employee
export const addEmployee = createAsyncThunk(
    'organisation/addEmployee',
    async (employeeData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/employees', employeeData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add employee');
        }
    }
);

// Update Employee
export const updateEmployee = createAsyncThunk(
    'organisation/updateEmployee',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/employees/${id}`, updatedData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update employee');
        }
    }
);

// Delete Employee
export const deleteEmployee = createAsyncThunk(
    'organisation/deleteEmployee',
    async ({ id, organizationId }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/employees/${id}`, {
                data: { organizationId }
            });
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete employee');
        }
    }
);

// Fetch Departments for Employee Form
export const fetchDepartments = createAsyncThunk(
    'organisation/fetchDepartmentsForEmployee',
    async (organizationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/departments?organizationId=${organizationId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch departments');
        }
    }
);

// Upload Employee Document
export const uploadEmployeeDocument = createAsyncThunk(
    'organisation/uploadEmployeeDocument',
    async ({ employeeId, documentType, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', documentType);

            const response = await axiosInstance.post(
                `/employees/${employeeId}/documents`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to upload document');
        }
    }
);

// Delete Employee Document
export const deleteEmployeeDocument = createAsyncThunk(
    'organisation/deleteEmployeeDocument',
    async ({ employeeId, documentId }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/employees/${employeeId}/documents/${documentId}`);
            return { documentId };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete document');
        }
    }
); 
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Helper function to handle retries
const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (error.response?.status === 429 && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryWithBackoff(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

// Fetch Employees
export const fetchEmployees = createAsyncThunk(
    'organisation/fetchEmployees',
    async ({ organizationId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            return await retryWithBackoff(async () => {
                const response = await axiosInstance.get(
                    `/employees?organizationId=${organizationId}&page=${page}&limit=${limit}`
                );
                return response.data;
            });
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
            return await retryWithBackoff(async () => {
                const response = await axiosInstance.post('/employees', employeeData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            });
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
            return await retryWithBackoff(async () => {
                const response = await axiosInstance.put(`/employees/${id}`, updatedData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            });
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update employee');
        }
    }
);

// Delete Employee
export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async ({ id, organizationId }, { rejectWithValue }) => {
        try {
            return await retryWithBackoff(async () => {
                await axiosInstance.delete(`/employees/${id}?organizationId=${organizationId}`);
                return { id };
            });
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
            return await retryWithBackoff(async () => {
                const response = await axiosInstance.get(`/departments?organizationId=${organizationId}`);
                return response.data;
            });
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
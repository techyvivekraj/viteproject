import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../components/api';

// Fetch Employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/employees', {
        params: { organizationId }
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
      // If no employee code is provided, generate one
      if (!employeeData.employeeCode) {
        employeeData.employeeCode = `EMP${Date.now().toString().slice(-6)}`;
      }
      
      // Handle default values for department, designation, and shift
      const dataToSend = { ...employeeData };
      
      // If default values are selected, remove them from the request
      // The API will assign default values on the backend
      if (dataToSend.departmentId === 'default') {
        delete dataToSend.departmentId;
      }
      
      if (dataToSend.designationId === 'default') {
        delete dataToSend.designationId;
      }
      
      if (dataToSend.shiftId === 'default') {
        delete dataToSend.shiftId;
      }
      
      // Always remove reportingManagerId - it's causing issues
      delete dataToSend.reportingManagerId;

      // Check if we need to use FormData (for file uploads)
      const hasFiles = Object.values(dataToSend.documents || {}).some(files => files.length > 0);
      
      if (hasFiles) {
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add all employee data to FormData
        Object.entries(dataToSend).forEach(([key, value]) => {
          if (key !== 'documents' && value !== null && value !== undefined && value !== '') {
            // Handle arrays and objects by converting to JSON strings
            if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });
        
        // Add documents if any
        if (dataToSend.documents) {
          Object.entries(dataToSend.documents).forEach(([category, files]) => {
            if (files && files.length > 0) {
              files.forEach((file, index) => {
                formData.append(`documents[${category}][${index}]`, file);
              });
            }
          });
        }
        
        console.log('Sending form data with files');
        
        const response = await axiosInstance.post('/employees', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } else {
        // No files, use regular JSON request
        console.log('Sending JSON data:', dataToSend);
        const response = await axiosInstance.post('/employees', dataToSend);
        return response.data;
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      
      // Provide detailed error information
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else if (error.message) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'Failed to add employee' });
      }
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

// Get Employee by ID
export const getEmployeeById = createAsyncThunk(
  'employees/getEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employee details');
    }
  }
);

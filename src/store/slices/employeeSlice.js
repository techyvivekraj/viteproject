import { createSlice } from '@reduxjs/toolkit';
import {
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    fetchDepartments,
    uploadEmployeeDocument,
    deleteEmployeeDocument
} from '../actions/employee';

const initialState = {
    employees: null,
    departments: null,
    loading: false,
    error: null,
    lastFetch: null,
    addEmployeeStatus: 'idle',
    addEmployeeError: null,
    updateStatus: 'idle',
    updateError: null,
    documentUploadStatus: 'idle',
    documentUploadError: null
};

const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        resetAddEmployeeStatus: (state) => {
            state.addEmployeeStatus = 'idle';
            state.addEmployeeError = null;
        },
        resetUpdateStatus: (state) => {
            state.updateStatus = 'idle';
            state.updateError = null;
        },
        resetDocumentUploadStatus: (state) => {
            state.documentUploadStatus = 'idle';
            state.documentUploadError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Employees
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload;
                state.loading = false;
                state.lastFetch = Date.now();
                state.error = null;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.employees = null;
            })

            // Add Employee
            .addCase(addEmployee.pending, (state) => {
                state.addEmployeeStatus = 'loading';
                state.addEmployeeError = null;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.addEmployeeStatus = 'succeeded';
                if (state.employees?.data) {
                    // The data structure is already correct, just add it to the array
                    state.employees.data.unshift(action.payload.data);
                }
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.addEmployeeStatus = 'failed';
                state.addEmployeeError = action.payload;
            })

            // Update Employee
            .addCase(updateEmployee.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                if (state.employees?.data && Array.isArray(state.employees.data)) {
                    const index = state.employees.data.findIndex(emp => emp.id === action.payload.data.id);
                    if (index !== -1) {
                        state.employees.data[index] = action.payload.data;
                    }
                }
                state.updateStatus = 'succeeded';
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            })

            // Delete Employee
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                if (state.employees?.data && Array.isArray(state.employees.data)) {
                    state.employees.data = state.employees.data.filter(
                        emp => emp.id !== action.payload.id
                    );
                }
            })

            // Fetch Departments
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload;
            })

            // Upload Employee Document
            .addCase(uploadEmployeeDocument.pending, (state) => {
                state.documentUploadStatus = 'loading';
                state.documentUploadError = null;
            })
            .addCase(uploadEmployeeDocument.fulfilled, (state, action) => {
                if (state.employees?.data && Array.isArray(state.employees.data)) {
                    const employeeIndex = state.employees.data.findIndex(
                        emp => emp.id === action.payload.data.employeeId
                    );
                    if (employeeIndex !== -1) {
                        if (!state.employees.data[employeeIndex].documents) {
                            state.employees.data[employeeIndex].documents = [];
                        }
                        state.employees.data[employeeIndex].documents.push(action.payload.data);
                    }
                }
                state.documentUploadStatus = 'succeeded';
            })
            .addCase(uploadEmployeeDocument.rejected, (state, action) => {
                state.documentUploadStatus = 'failed';
                state.documentUploadError = action.payload;
            })

            // Delete Employee Document
            .addCase(deleteEmployeeDocument.fulfilled, (state, action) => {
                if (state.employees?.data && Array.isArray(state.employees.data)) {
                    state.employees.data = state.employees.data.map(employee => {
                        if (employee.documents) {
                            employee.documents = employee.documents.filter(
                                doc => doc.id !== action.payload.documentId
                            );
                        }
                        return employee;
                    });
                }
            });
    }
});

// Export actions
export const {
    resetAddEmployeeStatus,
    resetUpdateStatus,
    resetDocumentUploadStatus
} = employeeSlice.actions;

// Export selectors
export const selectEmployees = (state) => state.employees.employees;
export const selectDepartments = (state) => state.employees.departments;
export const selectLoading = (state) => state.employees.loading;
export const selectError = (state) => state.employees.error;
export const selectLastFetch = (state) => state.employees.lastFetch;
export const selectAddEmployeeStatus = (state) => state.employees.addEmployeeStatus;
export const selectAddEmployeeError = (state) => state.employees.addEmployeeError;
export const selectUpdateStatus = (state) => state.employees.updateStatus;
export const selectUpdateError = (state) => state.employees.updateError;
export const selectDocumentUploadStatus = (state) => state.employees.documentUploadStatus;
export const selectDocumentUploadError = (state) => state.employees.documentUploadError;

// Export reducer
export default employeeSlice.reducer; 
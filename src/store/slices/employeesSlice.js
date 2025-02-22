import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  fetchEmployeeById
} from '../actions/employees';

const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    selectedEmployee: null,
    loading: false,
    updating: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
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
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Employee By Id
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updating = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  }
});

// Actions
export const { clearError, clearSelectedEmployee } = employeesSlice.actions;

// Selectors
export const selectEmployees = (state) => state.employees.employees;
export const selectSelectedEmployee = (state) => state.employees.selectedEmployee;
export const selectEmployeesLoading = (state) => state.employees.loading;
export const selectEmployeesUpdating = (state) => state.employees.updating;
export const selectEmployeesError = (state) => state.employees.error;

export default employeesSlice.reducer;
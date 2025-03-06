import { createSlice } from '@reduxjs/toolkit';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../actions/employees';

const initialState = {
  employees: [],
  loading: false,
  error: null,
  lastFetch: null,
  addEmployeeStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addEmployeeError: null
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    resetAddEmployeeStatus: (state) => {
      state.addEmployeeStatus = 'idle';
      state.addEmployeeError = null;
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
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.addEmployeeStatus = 'loading';
        state.addEmployeeError = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
        state.addEmployeeStatus = 'succeeded';
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.addEmployeeStatus = 'failed';
        state.addEmployeeError = action.payload;
      })
      // Update Employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) state.employees[index] = action.payload;
      })
      // Delete Employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload.id);
      });
  }
});

export const { resetAddEmployeeStatus } = employeesSlice.actions;

export const selectEmployees = (state) => state.employees.employees;
export const selectEmployeesLoading = (state) => state.employees.loading;
export const selectEmployeesError = (state) => state.employees.error;
export const selectLastFetch = (state) => state.employees.lastFetch;
export const selectAddEmployeeStatus = (state) => state.employees.addEmployeeStatus;
export const selectAddEmployeeError = (state) => state.employees.addEmployeeError;

export default employeesSlice.reducer;

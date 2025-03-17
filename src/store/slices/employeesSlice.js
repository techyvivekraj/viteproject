import { createSlice } from '@reduxjs/toolkit';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee, getEmployeeById } from '../actions/employees';

const initialState = {
  employees: null,
  currentEmployee: null,
  loading: false,
  error: null,
  lastFetch: null,
  addEmployeeStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addEmployeeError: null,
  updateEmployeeStatus: 'idle',
  updateEmployeeError: null
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    resetAddEmployeeStatus: (state) => {
      state.addEmployeeStatus = 'idle';
      state.addEmployeeError = null;
    },
    resetUpdateEmployeeStatus: (state) => {
      state.updateEmployeeStatus = 'idle';
      state.updateEmployeeError = null;
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
      
      // Get Employee by ID
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.currentEmployee = action.payload;
        state.loading = false;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.addEmployeeStatus = 'loading';
        state.addEmployeeError = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        if (state.employees?.data && Array.isArray(state.employees.data)) {
          state.employees.data.push(action.payload.data);
        }
        state.addEmployeeStatus = 'succeeded';
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.addEmployeeStatus = 'failed';
        state.addEmployeeError = action.payload;
      })
      
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.updateEmployeeStatus = 'loading';
        state.updateEmployeeError = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        if (state.employees?.data && Array.isArray(state.employees.data)) {
          const index = state.employees.data.findIndex(emp => emp.id === action.payload.data.id);
          if (index !== -1) {
            state.employees.data[index] = action.payload.data;
          }
        }
        state.updateEmployeeStatus = 'succeeded';
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateEmployeeStatus = 'failed';
        state.updateEmployeeError = action.payload;
      })
      
      // Delete Employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        if (state.employees?.data && Array.isArray(state.employees.data)) {
          state.employees.data = state.employees.data.filter(
            emp => emp.id !== action.payload.id
          );
        }
      });
  }
});

export const { resetAddEmployeeStatus, resetUpdateEmployeeStatus } = employeesSlice.actions;

export const selectEmployees = (state) => state.employees.employees;
export const selectCurrentEmployee = (state) => state.employees.currentEmployee;
export const selectEmployeesLoading = (state) => state.employees.loading;
export const selectEmployeesError = (state) => state.employees.error;
export const selectLastFetch = (state) => state.employees.lastFetch;
export const selectAddEmployeeStatus = (state) => state.employees.addEmployeeStatus;
export const selectAddEmployeeError = (state) => state.employees.addEmployeeError;
export const selectUpdateEmployeeStatus = (state) => state.employees.updateEmployeeStatus;
export const selectUpdateEmployeeError = (state) => state.employees.updateEmployeeError;

export default employeesSlice.reducer;

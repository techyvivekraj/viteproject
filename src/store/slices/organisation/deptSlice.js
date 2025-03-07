import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartments,
  fetchOrganizationDetails,
  updateOrganizationDetails
} from '../../actions/organisation/dept';

const initialState = {
  departments: [],
  organizationDetails: null,
  loading: false,
  error: null,
  lastFetch: null,
  addDepartmentStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addDepartmentError: null,
  updateStatus: 'idle',
  updateError: null
};

const deptSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    resetAddDepartmentStatus: (state) => {
      state.addDepartmentStatus = 'idle';
      state.addDepartmentError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Departments
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Department
      .addCase(addDepartment.pending, (state) => {
        state.addDepartmentStatus = 'loading';
        state.addDepartmentError = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        if (!Array.isArray(state.departments)) {
          state.departments = [];
        }
        state.departments.push(action.payload);
        state.addDepartmentStatus = 'succeeded';
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.addDepartmentStatus = 'failed';
        state.addDepartmentError = action.payload;
      })

      // Update Department
      .addCase(updateDepartment.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.departments.findIndex(departments => departments.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Department
      .addCase(deleteDepartments.fulfilled, (state, action) => {
        state.departments = state.departments.filter(departments => departments.id !== action.payload.id);
      })

      // Fetch Organization Details
      .addCase(fetchOrganizationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.organizationDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrganizationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Organization Details
      .addCase(updateOrganizationDetails.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateOrganizationDetails.fulfilled, (state, action) => {
        state.organizationDetails = action.payload;
        state.updateStatus = 'succeeded';
      })
      .addCase(updateOrganizationDetails.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      });
  }
});

// Export actions
export const { resetAddDepartmentStatus, resetUpdateStatus } = deptSlice.actions;

// Export selectors
export const selectDepartments = (state) => state.departments.departments;
export const selectLoading = (state) => state.departments.loading;
export const selectError = (state) => state.departments.error;
export const selectLastFetch = (state) => state.departments.lastFetch;
export const selectAddDepartmentStatus = (state) => state.departments.addDepartmentStatus;
export const selectAddDepartmentError = (state) => state.departments.addDepartmentError;
export const selectUpdateStatus = (state) => state.departments.updateStatus;
export const selectUpdateError = (state) => state.departments.updateError;
export const selectOrganizationDetails = (state) => state.departments.organizationDetails;

// Export reducer
export default deptSlice.reducer; 
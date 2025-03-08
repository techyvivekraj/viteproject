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
  departments: null,  // Changed from [] to null to better handle initial state
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
        // Store the complete API response
        state.departments = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.departments = null;
      })

      // Add Department
      .addCase(addDepartment.pending, (state) => {
        state.addDepartmentStatus = 'loading';
        state.addDepartmentError = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        if (state.departments?.data && Array.isArray(state.departments.data)) {
          state.departments.data.push(action.payload.data);
        }
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
        if (state.departments?.data && Array.isArray(state.departments.data)) {
          const index = state.departments.data.findIndex(dept => dept.id === action.payload.data.id);
          if (index !== -1) {
            state.departments.data[index] = action.payload.data;
          }
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Department
      .addCase(deleteDepartments.fulfilled, (state, action) => {
        if (state.departments?.data && Array.isArray(state.departments.data)) {
          state.departments.data = state.departments.data.filter(
            dept => dept.id !== action.payload.id
          );
        }
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
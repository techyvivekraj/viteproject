import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDesignations,
  addDesignation,
  updateDesignation,
  deleteDesignation
} from '../../actions/organisation/designation';

const initialState = {
  designations: null,
  loading: false,
  error: null,
  lastFetch: null,
  addStatus: 'idle',
  addError: null,
  updateStatus: 'idle',
  updateError: null
};

const designationSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
      state.addError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Designations
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.designations = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Designation
      .addCase(addDesignation.pending, (state) => {
        state.addStatus = 'loading';
        state.addError = null;
      })
      .addCase(addDesignation.fulfilled, (state, action) => {
        if (state.designations?.data) {
          state.designations.data.push(action.payload.data);
        }
        state.addStatus = 'succeeded';
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.addError = action.payload;
      })

      // Update Designation
      .addCase(updateDesignation.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        if (state.designations?.data) {
          const index = state.designations.data.findIndex(
            desig => desig.id === action.payload.data.id
          );
          if (index !== -1) {
            state.designations.data[index] = action.payload.data;
          }
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Designation
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        if (state.designations?.data) {
          state.designations.data = state.designations.data.filter(
            desig => desig.id !== action.payload.id
          );
        }
      });
  }
});

export const { resetAddStatus, resetUpdateStatus } = designationSlice.actions;

export const selectDesignations = (state) => state.designations.designations;
export const selectLoading = (state) => state.designations.loading;
export const selectError = (state) => state.designations.error;
export const selectLastFetch = (state) => state.designations.lastFetch;
export const selectAddStatus = (state) => state.designations.addStatus;
export const selectAddError = (state) => state.designations.addError;
export const selectUpdateStatus = (state) => state.designations.updateStatus;
export const selectUpdateError = (state) => state.designations.updateError;

export default designationSlice.reducer; 
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdvanceRecords,
  fetchAdvancebyMonthRecords,
  addAdvance,
  deleteAdvance
} from '../actions/advance';

const advanceSlice = createSlice({
  name: 'advance',
  initialState: {
    advanceRecords: [],
    selectedAdvance: null,
    loading: false,
    updating: false,
    error: null
  },
  reducers: {
    setSelectedAdvance: (state, action) => {
      state.selectedAdvance = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Advance Records
      .addCase(fetchAdvanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.advanceRecords = action.payload;
      })
      .addCase(fetchAdvanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Monthly Records
      .addCase(fetchAdvancebyMonthRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvancebyMonthRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.advanceRecords = action.payload;
      })
      .addCase(fetchAdvancebyMonthRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Advance
      .addCase(addAdvance.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addAdvance.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(addAdvance.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete Advance
      .addCase(deleteAdvance.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(deleteAdvance.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(deleteAdvance.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  }
});

// Actions
export const { setSelectedAdvance, clearError } = advanceSlice.actions;

// Selectors
export const selectAdvanceRecords = (state) => state.advance.advanceRecords;
export const selectAdvanceLoading = (state) => state.advance.loading;
export const selectAdvanceUpdating = (state) => state.advance.updating;
export const selectAdvanceError = (state) => state.advance.error;
export const selectSelectedAdvance = (state) => state.advance.selectedAdvance;

export default advanceSlice.reducer; 
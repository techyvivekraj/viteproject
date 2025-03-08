import { createSlice } from '@reduxjs/toolkit';
import {
  fetchShifts,
  addShifts,
  updateShift,
  deleteShift,
  fetchShiftAssignments,
  assignShift
} from '../../actions/organisation/shift';

const initialState = {
  shifts: null,
  shiftAssignments: {},
  loading: false,
  error: null,
  lastFetch: null,
  addStatus: 'idle',
  addError: null,
  updateStatus: 'idle',
  updateError: null,
  assignmentStatus: 'idle',
  assignmentError: null
};

const shiftSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
      state.addError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
    resetAssignmentStatus: (state) => {
      state.assignmentStatus = 'idle';
      state.assignmentError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shifts
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.shifts = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Shift
      .addCase(addShifts.pending, (state) => {
        state.addStatus = 'loading';
        state.addError = null;
      })
      .addCase(addShifts.fulfilled, (state, action) => {
        if (state.shifts?.data) {
          state.shifts.data.push(action.payload.data);
        }
        state.addStatus = 'succeeded';
      })
      .addCase(addShifts.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.addError = action.payload;
      })

      // Update Shift
      .addCase(updateShift.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        if (state.shifts?.data) {
          const index = state.shifts.data.findIndex(shift => shift.id === action.payload.data.id);
          if (index !== -1) {
            state.shifts.data[index] = action.payload.data;
          }
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Shift
      .addCase(deleteShift.fulfilled, (state, action) => {
        if (state.shifts?.data) {
          state.shifts.data = state.shifts.data.filter(shift => shift.id !== action.payload.id);
        }
        // Also remove from assignments if present
        if (state.shiftAssignments[action.payload.id]) {
          delete state.shiftAssignments[action.payload.id];
        }
      })

      // Fetch Shift Assignments
      .addCase(fetchShiftAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShiftAssignments.fulfilled, (state, action) => {
        state.shiftAssignments = {
          ...state.shiftAssignments,
          [action.meta.arg.departmentId]: action.payload
        };
        state.loading = false;
      })
      .addCase(fetchShiftAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  resetAddStatus,
  resetUpdateStatus,
  resetAssignmentStatus
} = shiftSlice.actions;

// Export selectors
export const selectShifts = (state) => state.shifts.shifts;
export const selectLoading = (state) => state.shifts.loading;
export const selectError = (state) => state.shifts.error;
export const selectLastFetch = (state) => state.shifts.lastFetch;
export const selectAddShiftStatus = (state) => state.shifts.addStatus;
export const selectAddShiftError = (state) => state.shifts.addError;
export const selectUpdateShiftStatus = (state) => state.shifts.updateStatus;
export const selectUpdateShiftError = (state) => state.shifts.updateError;
export const selectShiftAssignments = (departmentId) => (state) => 
  state.shifts.shiftAssignments[departmentId];
export const selectAssignmentStatus = (state) => state.shifts.assignmentStatus;
export const selectAssignmentError = (state) => state.shifts.assignmentError;

// Export reducer
export default shiftSlice.reducer; 
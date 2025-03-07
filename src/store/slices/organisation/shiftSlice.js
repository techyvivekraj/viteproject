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
  shifts: [],
  shiftAssignments: {},
  loading: false,
  error: null,
  lastFetch: null,
  addShiftStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addShiftError: null,
  updateStatus: 'idle',
  updateError: null,
  assignmentStatus: 'idle',
  assignmentError: null
};

const shiftSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    resetAddShiftStatus: (state) => {
      state.addShiftStatus = 'idle';
      state.addShiftError = null;
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
        state.addShiftStatus = 'loading';
        state.addShiftError = null;
      })
      .addCase(addShifts.fulfilled, (state, action) => {
        state.shifts.push(action.payload);
        state.addShiftStatus = 'succeeded';
      })
      .addCase(addShifts.rejected, (state, action) => {
        state.addShiftStatus = 'failed';
        state.addShiftError = action.payload;
      })

      // Update Shift
      .addCase(updateShift.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.shifts.findIndex(shift => shift.shiftId === action.payload.shiftId);
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Shift
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.shifts = state.shifts.filter(shift => shift.shiftId !== action.payload.shiftId);
        // Also remove from assignments if present
        if (state.shiftAssignments[action.payload.shiftId]) {
          delete state.shiftAssignments[action.payload.shiftId];
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
      })

      // Assign Shift
      .addCase(assignShift.pending, (state) => {
        state.assignmentStatus = 'loading';
        state.assignmentError = null;
      })
      .addCase(assignShift.fulfilled, (state, action) => {
        // Update assignments for the relevant department
        const { departmentId } = action.meta.arg;
        if (state.shiftAssignments[departmentId]) {
          state.shiftAssignments[departmentId] = action.payload;
        }
        state.assignmentStatus = 'succeeded';
      })
      .addCase(assignShift.rejected, (state, action) => {
        state.assignmentStatus = 'failed';
        state.assignmentError = action.payload;
      });
  }
});

// Export actions
export const {
  resetAddShiftStatus,
  resetUpdateStatus,
  resetAssignmentStatus
} = shiftSlice.actions;

// Export selectors
export const selectShifts = (state) => state.shifts.shifts;
export const selectLoading = (state) => state.shifts.loading;
export const selectError = (state) => state.shifts.error;
export const selectLastFetch = (state) => state.shifts.lastFetch;
export const selectAddShiftStatus = (state) => state.shifts.addShiftStatus;
export const selectAddShiftError = (state) => state.shifts.addShiftError;
export const selectUpdateStatus = (state) => state.shifts.updateStatus;
export const selectUpdateError = (state) => state.shifts.updateError;
export const selectShiftAssignments = (departmentId) => (state) => 
  state.shifts.shiftAssignments[departmentId];
export const selectAssignmentStatus = (state) => state.shifts.assignmentStatus;
export const selectAssignmentError = (state) => state.shifts.assignmentError;

// Export reducer
export default shiftSlice.reducer; 
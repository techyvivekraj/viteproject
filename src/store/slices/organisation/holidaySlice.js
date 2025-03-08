import { createSlice } from '@reduxjs/toolkit';
import {
  fetchHolidays,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  fetchHolidayCalendar
} from '../../actions/organisation/holidays';

const initialState = {
  holidays: null,
  loading: false,
  error: null,
  lastFetch: null,
  addStatus: 'idle',
  addError: null,
  updateStatus: 'idle',
  updateError: null,
  deleteStatus: 'idle',
  deleteError: null
};

const holidaySlice = createSlice({
  name: 'holidays',
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
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
      state.deleteError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Holidays
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.holidays = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Holiday
      .addCase(addHoliday.pending, (state) => {
        state.addStatus = 'loading';
        state.addError = null;
      })
      .addCase(addHoliday.fulfilled, (state, action) => {
        if (state.holidays?.data) {
          state.holidays.data.push(action.payload.data);
        }
        state.addStatus = 'succeeded';
      })
      .addCase(addHoliday.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.addError = action.payload;
      })

      // Update Holiday
      .addCase(updateHoliday.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateHoliday.fulfilled, (state, action) => {
        if (state.holidays?.data) {
          const index = state.holidays.data.findIndex(
            holiday => holiday.id === action.payload.data.id
          );
          if (index !== -1) {
            state.holidays.data[index] = action.payload.data;
          }
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Holiday
      .addCase(deleteHoliday.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        if (state.holidays?.data) {
          state.holidays.data = state.holidays.data.filter(
            holiday => holiday.id !== action.payload.id
          );
        }
        state.deleteStatus = 'succeeded';
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload;
      })

      // Fetch Holiday Calendar
      .addCase(fetchHolidayCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayCalendar.fulfilled, (state, action) => {
        state.calendar = action.payload;
        state.loading = false;
      })
      .addCase(fetchHolidayCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  resetAddStatus,
  resetUpdateStatus,
  resetDeleteStatus
} = holidaySlice.actions;

// Export selectors
export const selectHolidays = (state) => state.holidays.holidays;
export const selectLoading = (state) => state.holidays.loading;
export const selectError = (state) => state.holidays.error;
export const selectLastFetch = (state) => state.holidays.lastFetch;
export const selectAddStatus = (state) => state.holidays.addStatus;
export const selectAddError = (state) => state.holidays.addError;
export const selectUpdateStatus = (state) => state.holidays.updateStatus;
export const selectUpdateError = (state) => state.holidays.updateError;
export const selectDeleteStatus = (state) => state.holidays.deleteStatus;
export const selectDeleteError = (state) => state.holidays.deleteError;

// Export reducer
export default holidaySlice.reducer; 
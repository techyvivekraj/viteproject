import { createSlice } from '@reduxjs/toolkit';
import {
  fetchHolidays,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  fetchHolidayCalendar
} from '../../actions/organisation/holidays';

const initialState = {
  holidays: [],
  calendar: {},
  loading: false,
  error: null,
  lastFetch: null,
  addHolidayStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addHolidayError: null,
  updateStatus: 'idle',
  updateError: null,
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1
};

const holidaySlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {
    resetAddHolidayStatus: (state) => {
      state.addHolidayStatus = 'idle';
      state.addHolidayError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
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
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Holiday
      .addCase(addHoliday.pending, (state) => {
        state.addHolidayStatus = 'loading';
        state.addHolidayError = null;
      })
      .addCase(addHoliday.fulfilled, (state, action) => {
        state.holidays.push(action.payload);
        state.addHolidayStatus = 'succeeded';
        // Update calendar if the holiday is for the current view
        if (state.calendar[action.payload.holidayDate]) {
          state.calendar[action.payload.holidayDate].holidays.push(action.payload);
        }
      })
      .addCase(addHoliday.rejected, (state, action) => {
        state.addHolidayStatus = 'failed';
        state.addHolidayError = action.payload;
      })

      // Update Holiday
      .addCase(updateHoliday.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateHoliday.fulfilled, (state, action) => {
        const index = state.holidays.findIndex(
          holiday => holiday.holidayId === action.payload.holidayId
        );
        if (index !== -1) {
          state.holidays[index] = action.payload;
        }
        state.updateStatus = 'succeeded';
        // Update calendar if necessary
        if (state.calendar[action.payload.holidayDate]) {
          const calendarIndex = state.calendar[action.payload.holidayDate].holidays
            .findIndex(h => h.holidayId === action.payload.holidayId);
          if (calendarIndex !== -1) {
            state.calendar[action.payload.holidayDate].holidays[calendarIndex] = action.payload;
          }
        }
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Holiday
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.holidays = state.holidays.filter(
          holiday => holiday.holidayId !== action.payload.holidayId
        );
        // Remove from calendar if present
        Object.keys(state.calendar).forEach(date => {
          state.calendar[date].holidays = state.calendar[date].holidays.filter(
            h => h.holidayId !== action.payload.holidayId
          );
        });
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
  resetAddHolidayStatus,
  resetUpdateStatus,
  setSelectedYear,
  setSelectedMonth
} = holidaySlice.actions;

// Export selectors
export const selectHolidays = (state) => state.holidays.holidays;
export const selectLoading = (state) => state.holidays.loading;
export const selectError = (state) => state.holidays.error;
export const selectLastFetch = (state) => state.holidays.lastFetch;
export const selectAddHolidayStatus = (state) => state.holidays.addHolidayStatus;
export const selectAddHolidayError = (state) => state.holidays.addHolidayError;
export const selectUpdateStatus = (state) => state.holidays.updateStatus;
export const selectUpdateError = (state) => state.holidays.updateError;
export const selectHolidayCalendar = (state) => state.holidays.calendar;
export const selectSelectedYear = (state) => state.holidays.selectedYear;
export const selectSelectedMonth = (state) => state.holidays.selectedMonth;

// Export reducer
export default holidaySlice.reducer; 
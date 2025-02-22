import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchDashboardStats, 
  fetchAttendanceOverview,
} from '../actions/dashboard';

const initialState = {
  stats: {
    totalEmployees: 0,
    onLeaveToday: 0,
    pendingLeaves: 0,
    monthlyPayroll: 0,
    finesCollected: 0,
    overtimeHours: 0,
    activeLoans: 0,
  },
  attendance: {
    todayStats: {
      present: 0,
      absent: 0,
      late: 0,
      total: 0
    },
    weeklyData: [],
    loading: false,
    error: null
  },
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendanceOverview.pending, (state) => {
        state.attendance.loading = true;
        state.attendance.error = null;
      })
      .addCase(fetchAttendanceOverview.fulfilled, (state, action) => {
        state.attendance.loading = false;
        state.attendance.todayStats = action.payload.today;
        state.attendance.weeklyData = action.payload.weekly;
      })
      .addCase(fetchAttendanceOverview.rejected, (state, action) => {
        state.attendance.loading = false;
        state.attendance.error = action.payload;
      });
  }
});

export const { clearError } = dashboardSlice.actions;

export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer; 
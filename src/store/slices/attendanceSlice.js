import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchAttendances, 
    updateAttendanceStatus, 
    fetchAttendancebyMonthRecords,
    updateAttendance,
    deleteAttendance 
} from '../actions/attendance';

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        attendances: [],
        attendanceDetails: {
            summary: {
                presentDays: 0,
                absentDays: 0,
                notSetDays: 0,
                lateEntries: 0,
                earlyExits: 0
            },
            history: []
        },
        loading: false,
        error: null,
        updating: false
    },
    extraReducers: (builder) => {
        builder
            // Fetch Attendances
            .addCase(fetchAttendances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttendances.fulfilled, (state, action) => {
                state.loading = false;
                state.attendances = action.payload;
            })
            .addCase(fetchAttendances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Attendance Status
            .addCase(updateAttendanceStatus.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateAttendanceStatus.fulfilled, (state) => {
                state.updating = false;
            })
            .addCase(updateAttendanceStatus.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })
            // Fetch Monthly Records
            .addCase(fetchAttendancebyMonthRecords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttendancebyMonthRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceDetails = action.payload;
            })
            .addCase(fetchAttendancebyMonthRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Attendance
            .addCase(updateAttendance.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateAttendance.fulfilled, (state) => {
                state.updating = false;
            })
            .addCase(updateAttendance.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })
            // Delete Attendance
            .addCase(deleteAttendance.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(deleteAttendance.fulfilled, (state) => {
                state.updating = false;
            })
            .addCase(deleteAttendance.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            });
    }
});

// Selectors
export const selectAttendances = (state) => state.attendance.attendances;
export const selectAttendanceLoading = (state) => state.attendance.loading;
export const selectAttendanceError = (state) => state.attendance.error;
export const selectAttendanceUpdating = (state) => state.attendance.updating;
export const selectAttendanceDetails = (state) => state.attendance.attendanceDetails;

export default attendanceSlice.reducer; 
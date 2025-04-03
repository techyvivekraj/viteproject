import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    attendanceList: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    }
};

// Selectors
export const selectAttendance = (state) => ({
    data: state.attendance.attendanceList,
    pagination: state.attendance.pagination
});

export const selectLoading = (state) => state.attendance.loading;

export const selectCheckInStatus = (state) => state.attendance.checkInStatus;

export const selectCheckOutStatus = (state) => state.attendance.checkOutStatus;

export const selectApprovalStatus = (state) => state.attendance.approvalStatus;

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        clearAttendanceError: (state) => {
            state.error = null;
        },
        resetAttendanceState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Attendance
            .addCase('attendance/fetchAttendance/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('attendance/fetchAttendance/fulfilled', (state, action) => {
                state.loading = false;
                state.attendanceList = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase('attendance/fetchAttendance/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Mark Attendance
            .addCase('attendance/markAttendance/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('attendance/markAttendance/fulfilled', (state, action) => {
                state.loading = false;
                // Add new attendance to the list
                state.attendanceList.unshift(action.payload.data);
                state.pagination.total += 1;
            })
            .addCase('attendance/markAttendance/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Edit Attendance
            .addCase('attendance/editAttendance/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('attendance/editAttendance/fulfilled', (state, action) => {
                state.loading = false;
                // Update attendance in the list
                const index = state.attendanceList.findIndex(
                    item => item.attendance_id === action.payload.data.id
                );
                if (index !== -1) {
                    state.attendanceList[index] = action.payload.data;
                }
            })
            .addCase('attendance/editAttendance/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Approval Status
            .addCase('attendance/updateApproval/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('attendance/updateApproval/fulfilled', (state, action) => {
                state.loading = false;
                // Update attendance approval status in the list
                const index = state.attendanceList.findIndex(
                    item => item.attendance_id === action.payload.data.id
                );
                if (index !== -1) {
                    state.attendanceList[index] = action.payload.data;
                }
            })
            .addCase('attendance/updateApproval/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAttendanceError, resetAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer; 
import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchAttendance, 
    markCheckIn, 
    markCheckOut, 
    updateAttendanceApproval 
} from '../actions/attendance';

const initialState = {
    attendance: {
        data: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        }
    },
    loading: false,
    error: null,
    checkInStatus: 'idle',
    checkInError: null,
    checkOutStatus: 'idle',
    checkOutError: null,
    approvalStatus: 'idle',
    approvalError: null
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        resetCheckInStatus: (state) => {
            state.checkInStatus = 'idle';
            state.checkInError = null;
        },
        resetCheckOutStatus: (state) => {
            state.checkOutStatus = 'idle';
            state.checkOutError = null;
        },
        resetApprovalStatus: (state) => {
            state.approvalStatus = 'idle';
            state.approvalError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Attendance
            .addCase(fetchAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttendance.fulfilled, (state, action) => {
                state.attendance = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark Check-in
            .addCase(markCheckIn.pending, (state) => {
                state.checkInStatus = 'loading';
                state.checkInError = null;
            })
            .addCase(markCheckIn.fulfilled, (state, action) => {
                state.checkInStatus = 'succeeded';
                if (state.attendance?.data) {
                    state.attendance.data.unshift(action.payload.data);
                }
            })
            .addCase(markCheckIn.rejected, (state, action) => {
                state.checkInStatus = 'failed';
                state.checkInError = action.payload;
            })

            // Mark Check-out
            .addCase(markCheckOut.pending, (state) => {
                state.checkOutStatus = 'loading';
                state.checkOutError = null;
            })
            .addCase(markCheckOut.fulfilled, (state, action) => {
                state.checkOutStatus = 'succeeded';
                if (state.attendance?.data) {
                    const index = state.attendance.data.findIndex(
                        item => item.id === action.payload.data.id
                    );
                    if (index !== -1) {
                        state.attendance.data[index] = action.payload.data;
                    }
                }
            })
            .addCase(markCheckOut.rejected, (state, action) => {
                state.checkOutStatus = 'failed';
                state.checkOutError = action.payload;
            })

            // Update Approval Status
            .addCase(updateAttendanceApproval.pending, (state) => {
                state.approvalStatus = 'loading';
                state.approvalError = null;
            })
            .addCase(updateAttendanceApproval.fulfilled, (state, action) => {
                state.approvalStatus = 'succeeded';
                if (state.attendance?.data) {
                    const index = state.attendance.data.findIndex(
                        item => item.id === action.payload.data.id
                    );
                    if (index !== -1) {
                        state.attendance.data[index] = {
                            ...state.attendance.data[index],
                            approval_status: action.payload.data.status
                        };
                    }
                }
            })
            .addCase(updateAttendanceApproval.rejected, (state, action) => {
                state.approvalStatus = 'failed';
                state.approvalError = action.payload;
            });
    }
});

export const {
    resetCheckInStatus,
    resetCheckOutStatus,
    resetApprovalStatus
} = attendanceSlice.actions;

// Selectors
export const selectAttendance = (state) => state.attendance.attendance;
export const selectLoading = (state) => state.attendance.loading;
export const selectError = (state) => state.attendance.error;
export const selectCheckInStatus = (state) => state.attendance.checkInStatus;
export const selectCheckOutStatus = (state) => state.attendance.checkOutStatus;
export const selectApprovalStatus = (state) => state.attendance.approvalStatus;

export default attendanceSlice.reducer; 
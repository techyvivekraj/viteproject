import { createSlice } from '@reduxjs/toolkit';
import {
    fetchOvertime,
    addOvertime,
    updateOvertime,
    deleteOvertime
} from '../actions/overtime';

const initialState = {
    overtime: [],
    loading: false,
    error: null,
    addOvertimeStatus: 'idle',
    addOvertimeError: null,
    updateStatus: 'idle',
    updateError: null
};

const overtimeSlice = createSlice({
    name: 'overtime',
    initialState,
    reducers: {
        resetAddOvertimeStatus: (state) => {
            state.addOvertimeStatus = 'idle';
            state.addOvertimeError = null;
        },
        resetUpdateStatus: (state) => {
            state.updateStatus = 'idle';
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Overtime
            .addCase(fetchOvertime.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOvertime.fulfilled, (state, action) => {
                state.overtime = action.payload;
                state.loading = false;
            })
            .addCase(fetchOvertime.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add Overtime
            .addCase(addOvertime.pending, (state) => {
                state.addOvertimeStatus = 'loading';
                state.addOvertimeError = null;
            })
            .addCase(addOvertime.fulfilled, (state, action) => {
                state.overtime.push(action.payload);
                state.addOvertimeStatus = 'succeeded';
            })
            .addCase(addOvertime.rejected, (state, action) => {
                state.addOvertimeStatus = 'failed';
                state.addOvertimeError = action.payload;
            })
            
            // Update Overtime
            .addCase(updateOvertime.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updateOvertime.fulfilled, (state, action) => {
                const index = state.overtime.findIndex(ot => ot.id === action.payload.id);
                if (index !== -1) {
                    state.overtime[index] = action.payload;
                }
                state.updateStatus = 'succeeded';
            })
            .addCase(updateOvertime.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            })
            
            // Delete Overtime
            .addCase(deleteOvertime.fulfilled, (state, action) => {
                state.overtime = state.overtime.filter(ot => ot.id !== action.payload.id);
            });
    }
});

export const { resetAddOvertimeStatus, resetUpdateStatus } = overtimeSlice.actions;
export const selectOvertime = (state) => state.overtime.overtime;
export const selectLoading = (state) => state.overtime.loading;
export const selectError = (state) => state.overtime.error;
export const selectAddOvertimeStatus = (state) => state.overtime.addOvertimeStatus;
export const selectUpdateStatus = (state) => state.overtime.updateStatus;

export default overtimeSlice.reducer; 
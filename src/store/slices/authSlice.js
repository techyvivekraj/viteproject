import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser, validateUser } from "../actions/auth";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isRegistered: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetRegistered: (state) => {
            state.isRegistered = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isRegistered = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Validate User
            .addCase(validateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(validateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(validateUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
            });
    },
});

export const { clearError, resetRegistered } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsRegistered = (state) => state.auth.isRegistered;
export const selectError = (state) => state.auth.error;
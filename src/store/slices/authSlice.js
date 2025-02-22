import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: undefined,
        isLoading: false,
        error: null,
        isRegistered: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        setRegistered: (state, action) => {
            state.isRegistered = action.payload;
        }
    },
});

export const { setUser, setLoading, setError, logout, setRegistered } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state) => state.auth.user;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsRegistered = (state) => state.auth.isRegistered;
export const selectError = (state) => state.auth.error;
import { createSlice } from "@reduxjs/toolkit";

const assetsSlice = createSlice({
    name: "assets",
    initialState: {
        assets: [],
        loading: false,
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setAssets: (state, action) => {
            state.assets = action.payload;
        },
       
    },
});

// Export actions
export const { setLoading, setError, setAssets, } = assetsSlice.actions;

// Export the reducer to be used in the store
export default assetsSlice.reducer;

export const selectAssets = (state) => state.assets.assets;
export const selectLoading = (state) => state.assets.loading;
export const selectError = (state) => state.assets.error;
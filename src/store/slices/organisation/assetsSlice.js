import { createSlice } from '@reduxjs/toolkit';
import { fetchAssets, addAsset, updateAsset, deleteAsset } from '../../actions/organisation/assets';

const initialState = {
  assets: [],
  loading: false,
  error: null,
  lastFetch: null,
  addStatus: 'idle',  // Changed to match useAddRole pattern
  addError: null
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
      state.addError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Assets
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.assets = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Asset
      .addCase(addAsset.pending, (state) => {
        state.addStatus = 'loading';
        state.addError = null;
      })
      .addCase(addAsset.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        state.addError = null;
        // Refresh will happen through fetchAssets
      })
      .addCase(addAsset.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.addError = action.payload;
      })
      // Update Asset
      .addCase(updateAsset.fulfilled, (state, action) => {
        const index = state.assets.findIndex(asset => asset.id === action.payload.id);
        if (index !== -1) {
          state.assets[index] = action.payload;
        }
      })
      // Delete Asset
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter(asset => asset.id !== action.payload.id);
      });
  }
});

export const { resetAddStatus } = assetsSlice.actions;

// Updated selectors to match useAddRole pattern
export const selectAssets = (state) => state.assets.assets;
export const selectLoading = (state) => state.assets.loading;
export const selectError = (state) => state.assets.error;
export const selectLastFetch = (state) => state.assets.lastFetch;
export const selectAddStatus = (state) => state.assets.addStatus;
export const selectAddError = (state) => state.assets.addError;

export default assetsSlice.reducer; 
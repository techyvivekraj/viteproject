import { createSlice } from '@reduxjs/toolkit';
import { fetchAssets, addAsset, updateAsset, deleteAsset } from '../../actions/organisation/assets';

const initialState = {
  assets: null,
  loading: false,
  error: null,
  lastFetch: null,
  addStatus: 'idle',
  addError: null,
  updateStatus: 'idle',
  updateError: null
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
      state.addError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
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
        if (state.assets?.data) {
          state.assets.data.push(action.payload.data);
        }
        state.addStatus = 'succeeded';
      })
      .addCase(addAsset.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.addError = action.payload;
      })
      // Update Asset
      .addCase(updateAsset.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        if (state.assets?.data) {
          const index = state.assets.data.findIndex(asset => asset.id === action.payload.data.id);
          if (index !== -1) {
            state.assets.data[index] = action.payload.data;
          }
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateAsset.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })
      // Delete Asset
      .addCase(deleteAsset.fulfilled, (state, action) => {
        if (state.assets?.data) {
          state.assets.data = state.assets.data.filter(asset => asset.id !== action.payload.id);
        }
      });
  }
});

export const { resetAddStatus, resetUpdateStatus } = assetsSlice.actions;

// Export selectors with consistent naming
export const selectAssets = (state) => state.assets.assets;
export const selectLoading = (state) => state.assets.loading;
export const selectError = (state) => state.assets.error;
export const selectLastFetch = (state) => state.assets.lastFetch;
export const selectAddStatus = (state) => state.assets.addStatus;
export const selectAddError = (state) => state.assets.addError;
export const selectUpdateStatus = (state) => state.assets.updateStatus;
export const selectUpdateError = (state) => state.assets.updateError;

export default assetsSlice.reducer; 
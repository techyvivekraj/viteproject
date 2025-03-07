import { createSlice } from '@reduxjs/toolkit';
import { fetchAssets, addAsset, updateAsset, deleteAsset } from '../../actions/organisation/assets';

const initialState = {
  assets: [],
  loading: false,
  error: null,
  lastFetch: null,
  addAssetStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addAssetError: null
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resetAddAssetStatus: (state) => {
      state.addAssetStatus = 'idle';
      state.addAssetError = null;
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
        state.assets = action.payload || [];
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Asset
      .addCase(addAsset.pending, (state) => {
        state.addAssetStatus = 'loading';
        state.addAssetError = null;
      })
      .addCase(addAsset.fulfilled, (state, action) => {
        state.assets.push(action.payload);
        state.addAssetStatus = 'succeeded';
      })
      .addCase(addAsset.rejected, (state, action) => {
        state.addAssetStatus = 'failed';
        state.addAssetError = action.payload;
      })
      // Update Asset
      .addCase(updateAsset.fulfilled, (state, action) => {
        const index = state.assets.findIndex(asset => asset.id === action.payload.id);
        if (index !== -1) state.assets[index] = action.payload;
      })
      // Delete Asset
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter(asset => asset.id !== action.payload.id);
      });
  }
});

export const { resetAddAssetStatus } = assetsSlice.actions;

export const selectAssets = (state) => state.assets.assets;
export const selectLoading = (state) => state.assets.loading;
export const selectError = (state) => state.assets.error;
export const selectLastFetch = (state) => state.assets.lastFetch;
export const selectAddAssetStatus = (state) => state.assets.addAssetStatus;
export const selectAddAssetError = (state) => state.assets.addAssetError;

export default assetsSlice.reducer; 
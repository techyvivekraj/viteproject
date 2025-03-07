import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../components/api';

// Fetch Assets
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/assets', {
        organizationId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch assets');
    }
  }
);

// Add Asset
export const addAsset = createAsyncThunk(
  'assets/addAsset',
  async (assetData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/assets', assetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add asset');
    }
  }
);

// Update Asset
export const updateAsset = createAsyncThunk(
  'assets/updateAsset',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/assets/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update asset');
    }
  }
);

// Delete Asset
export const deleteAsset = createAsyncThunk(
  'assets/deleteAsset',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/assets/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete asset');
    }
  }
); 
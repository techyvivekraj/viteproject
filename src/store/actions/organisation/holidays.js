import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../components/api';

// Fetch Holidays
export const fetchHolidays = createAsyncThunk(
  'holidays/fetchHolidays',
  async ({ organizationId, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/holidays', {
        params: { 
          organizationId,
          year 
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch holidays');
    }
  }
);

// Add Holiday
export const addHoliday = createAsyncThunk(
  'holidays/addHoliday',
  async (holidayData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/holidays', holidayData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add holiday');
    }
  }
);

// Update Holiday
export const updateHoliday = createAsyncThunk(
  'holidays/updateHoliday',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/holidays/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update holiday');
    }
  }
);

// Delete Holiday
export const deleteHoliday = createAsyncThunk(
  'holidays/deleteHoliday',
  async ({ holidayId, organizationId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/holidays/${holidayId}`);
      return { holidayId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete holiday');
    }
  }
);

// Fetch Holiday Calendar
export const fetchHolidayCalendar = createAsyncThunk(
  'holidays/fetchCalendar',
  async ({ organizationId, year, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/holidays/calendar', {
        params: { 
          organizationId,
          year,
          month 
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch holiday calendar');
    }
  }
); 
import { createSlice } from '@reduxjs/toolkit';

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expensesRecords: [],
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
    setExpensesRecords: (state, action) => {
      state.expensesRecords = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setExpensesRecords,
} = expensesSlice.actions;

export const selectExpensesRecords = (state) => state.expenses.expensesRecords;
export const selectExpensesLoading = (state) => state.expenses.loading;
export const selectExpensesError = (state) => state.expenses.error;

export default expensesSlice.reducer; 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionState, TransactionType } from '../types/Transaction';
import { mockTransactions } from '../data/mockTransactions';
import { supabase } from '../lib/supabaseClient';

// Initial state
const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  filters: {
    type: 'all',
    wallet: 'all',
    token: 'all',
    dateRange: {
      start: null,
      end: null
    }
  },
  status: 'idle',
  error: null
};

// Helper function to apply filters
const applyFilters = (
  transactions: Transaction[],
  filters: TransactionState['filters']
): Transaction[] => {
  return transactions.filter(tx => {
    // Filter by type
    if (filters.type !== 'all' && tx.type !== filters.type) {
      return false;
    }
    
    // Filter by wallet
    if (filters.wallet !== 'all' && tx.wallet !== filters.wallet) {
      return false;
    }
    
    // Filter by token
    if (filters.token !== 'all' && tx.token_symbol !== filters.token) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange.start && new Date(tx.timestamp) < new Date(filters.dateRange.start)) {
      return false;
    }
    
    if (filters.dateRange.end && new Date(tx.timestamp) > new Date(filters.dateRange.end)) {
      return false;
    }
    
    return true;
  });
};

// Async thunk to fetch transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be a Supabase query
      // For MVP, we're using mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return mockTransactions;
      
      // Real implementation would be something like:
      // const { data, error } = await supabase
      //   .from('transactions')
      //   .select('*')
      //   .order('timestamp', { ascending: false });
      
      // if (error) throw error;
      // return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the transaction slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.filteredTransactions = applyFilters(action.payload, state.filters);
    },
    setTypeFilter: (state, action: PayloadAction<TransactionType | 'all'>) => {
      state.filters.type = action.payload;
      state.filteredTransactions = applyFilters(state.transactions, state.filters);
    },
    setWalletFilter: (state, action: PayloadAction<string | 'all'>) => {
      state.filters.wallet = action.payload;
      state.filteredTransactions = applyFilters(state.transactions, state.filters);
    },
    setTokenFilter: (state, action: PayloadAction<string | 'all'>) => {
      state.filters.token = action.payload;
      state.filteredTransactions = applyFilters(state.transactions, state.filters);
    },
    setDateRangeFilter: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
      state.filters.dateRange = action.payload;
      state.filteredTransactions = applyFilters(state.transactions, state.filters);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredTransactions = state.transactions;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.filteredTransactions = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTransactions
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
        state.filteredTransactions = applyFilters(action.payload, state.filters);
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const {
  setTransactions,
  setTypeFilter,
  setWalletFilter,
  setTokenFilter,
  setDateRangeFilter,
  resetFilters,
  clearTransactions
} = transactionSlice.actions;

export default transactionSlice.reducer;

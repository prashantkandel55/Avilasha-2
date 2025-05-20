import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokenState } from '../types/Token';
import axios from 'axios';

// Define initial state
const initialState: TokenState = {
  tokens: [],
  filteredTokens: [],
  selectedToken: null,
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'market_cap_rank',
  sortDirection: 'asc',
  page: 1,
  pageSize: 20,
  totalPages: 0
};

// Async thunk for fetching tokens from CoinGecko API
export const fetchTokens = createAsyncThunk(
  'tokens/fetchTokens',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a single token's details
export const fetchTokenDetails = createAsyncThunk(
  'tokens/fetchTokenDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`,
        {
          params: {
            localization: false,
            tickers: true,
            market_data: true,
            community_data: true,
            developer_data: true,
            sparkline: false
          }
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the token slice
const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1;
      filterAndSortTokens(state);
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      // If clicking the same column, toggle direction
      if (state.sortBy === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortDirection = 'asc';
      }
      filterAndSortTokens(state);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
      state.totalPages = Math.ceil(state.filteredTokens.length / state.pageSize);
    },
    selectToken: (state, action: PayloadAction<string>) => {
      state.selectedToken = state.tokens.find(token => token.id === action.payload) || null;
    },
    clearSelectedToken: (state) => {
      state.selectedToken = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tokens cases
      .addCase(fetchTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload;
        filterAndSortTokens(state);
      })
      .addCase(fetchTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch token details cases
      .addCase(fetchTokenDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTokenDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedToken = action.payload;
      })
      .addCase(fetchTokenDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Helper function to filter and sort tokens
const filterAndSortTokens = (state: TokenState) => {
  // Filter tokens based on search query
  const filtered = state.tokens.filter(token => {
    const query = state.searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query)
    );
  });
  
  // Sort tokens based on sort criteria
  const sorted = [...filtered].sort((a, b) => {
    const aValue = a[state.sortBy as keyof Token];
    const bValue = b[state.sortBy as keyof Token];
    
    // Handle string vs number comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return state.sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle number comparison
    if (state.sortDirection === 'asc') {
      return (aValue as number) - (bValue as number);
    } else {
      return (bValue as number) - (aValue as number);
    }
  });
  
  state.filteredTokens = sorted;
  state.totalPages = Math.ceil(sorted.length / state.pageSize);
};

export const { 
  setSearchQuery, 
  setSortBy, 
  setPage, 
  setPageSize,
  selectToken,
  clearSelectedToken
} = tokenSlice.actions;

export default tokenSlice.reducer;

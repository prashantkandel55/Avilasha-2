import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MarketState, MarketCoin } from '../types/Market';
import { marketService } from '../services/marketService';

// Initial state
const initialState: MarketState = {
  coins: [],
  status: 'idle',
  error: null,
  lastUpdated: null
};

// Async thunk to fetch top coins
export const fetchTopCoins = createAsyncThunk(
  'market/fetchTopCoins',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const data = await marketService.getTopCoins(limit);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch specific coins by IDs
export const fetchCoinsByIds = createAsyncThunk(
  'market/fetchCoinsByIds',
  async (coinIds: string[], { rejectWithValue }) => {
    try {
      const data = await marketService.getCoinsByIds(coinIds);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the market slice
const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearMarketData: (state) => {
      state.coins = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTopCoins
      .addCase(fetchTopCoins.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchTopCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // fetchCoinsByIds
      .addCase(fetchCoinsByIds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoinsByIds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCoinsByIds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearMarketData } = marketSlice.actions;
export default marketSlice.reducer;

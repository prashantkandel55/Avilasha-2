import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Asset, PortfolioState } from '../types/Asset';
import { mockAssets } from '../data/mockAssets';

// Helper function to calculate asset value
const calculateAssetValue = (asset: Asset): number => {
  return asset.price * asset.amount;
};

// Helper function to calculate total portfolio value
const calculateTotalValue = (assets: Asset[]): number => {
  return assets.reduce((total, asset) => total + calculateAssetValue(asset), 0);
};

// Helper function to calculate total 24h change
const calculateTotalChange = (assets: Asset[]): number => {
  const totalValue = calculateTotalValue(assets);
  if (totalValue === 0) return 0;
  
  const weightedChange = assets.reduce((total, asset) => {
    const assetValue = calculateAssetValue(asset);
    const weightedAssetChange = (assetValue / totalValue) * (asset.change24h || 0);
    return total + weightedAssetChange;
  }, 0);
  
  return weightedChange;
};

// Define the initial state
const initialState: PortfolioState = {
  assets: [],
  totalValue: 0,
  totalChange24h: 0,
  status: 'idle',
  error: null,
};

// Async thunk to fetch portfolio assets (mock data for MVP)
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to get the user's portfolio
      // For MVP, we're using mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate value for each asset
      const assetsWithValue = mockAssets.map(asset => ({
        ...asset,
        value: calculateAssetValue(asset)
      }));
      
      return assetsWithValue;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the portfolio slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setAssets: (state, action: PayloadAction<Asset[]>) => {
      state.assets = action.payload.map(asset => ({
        ...asset,
        value: calculateAssetValue(asset)
      }));
      state.totalValue = calculateTotalValue(state.assets);
      state.totalChange24h = calculateTotalChange(state.assets);
    },
    clearPortfolio: (state) => {
      state.assets = [];
      state.totalValue = 0;
      state.totalChange24h = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assets = action.payload;
        state.totalValue = calculateTotalValue(action.payload);
        state.totalChange24h = calculateTotalChange(action.payload);
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setAssets, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;

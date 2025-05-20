import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NFT, NFTState } from '../types/NFT';
import { mockNFTs } from '../data/mockNFTs';

// Initial state
const initialState: NFTState = {
  nfts: [],
  selectedNFT: null,
  status: 'idle',
  error: null
};

// Async thunk to fetch NFTs
export const fetchNFTs = createAsyncThunk(
  'nfts/fetchNFTs',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to get the user's NFTs
      // For MVP, we're using mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock data
      return mockNFTs;
      
      // Real implementation would be something like:
      // const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${walletAddress}`);
      // if (!response.ok) throw new Error('Failed to fetch NFTs');
      // const data = await response.json();
      // return data.assets;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the NFT slice
const nftSlice = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    setNFTs: (state, action: PayloadAction<NFT[]>) => {
      state.nfts = action.payload;
      state.status = 'succeeded';
    },
    selectNFT: (state, action: PayloadAction<string>) => {
      state.selectedNFT = state.nfts.find(nft => nft.id === action.payload) || null;
    },
    clearSelectedNFT: (state) => {
      state.selectedNFT = null;
    },
    clearNFTs: (state) => {
      state.nfts = [];
      state.selectedNFT = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchNFTs
      .addCase(fetchNFTs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNFTs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nfts = action.payload;
        state.error = null;
      })
      .addCase(fetchNFTs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { setNFTs, selectNFT, clearSelectedNFT, clearNFTs } = nftSlice.actions;
export default nftSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import pb from '../services/pocketbase';
import { Wallet, WalletState } from '../types/Wallet';

// Define the initial state
const initialState: WalletState = {
  wallets: [],
  status: 'idle',
  error: null,
};

// Helper function to validate Ethereum address
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Async thunks for wallet operations
export const fetchWallets = createAsyncThunk(
  'wallet/fetchWallets',
  async (_, { rejectWithValue }) => {
    try {
      // Check if user is authenticated
      if (!pb.authStore.isValid) {
        return rejectWithValue('User not authenticated');
      }
      
      const userId = pb.authStore.model?.id;
      
      // Fetch wallets from PocketBase
      const records = await pb.collection('wallets').getFullList({
        filter: `user_id="${userId}"`
      });
      
      return records as unknown as Wallet[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addWallet = createAsyncThunk(
  'wallet/addWallet',
  async (wallet: Wallet, { rejectWithValue }) => {
    try {
      // Validate Ethereum address
      if (!isValidEthereumAddress(wallet.address)) {
        return rejectWithValue('Invalid Ethereum address');
      }
      
      // Check if user is authenticated
      if (!pb.authStore.isValid) {
        return rejectWithValue('User not authenticated');
      }
      
      const userId = pb.authStore.model?.id;
      
      const newWallet = {
        ...wallet,
        user_id: userId,
      };
      
      // Create wallet in PocketBase
      const record = await pb.collection('wallets').create(newWallet);
      
      return record as unknown as Wallet;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeWallet = createAsyncThunk(
  'wallet/removeWallet',
  async (walletId: string, { rejectWithValue }) => {
    try {
      // Delete wallet from PocketBase
      await pb.collection('wallets').delete(walletId);
      
      return walletId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the wallet slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWallets: (state) => {
      state.wallets = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallets
      .addCase(fetchWallets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallets = action.payload;
        state.error = null;
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Add Wallet
      .addCase(addWallet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallets.push(action.payload);
        state.error = null;
      })
      .addCase(addWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Remove Wallet
      .addCase(removeWallet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallets = state.wallets.filter(wallet => wallet.id !== action.payload);
        state.error = null;
      })
      .addCase(removeWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearWallets } = walletSlice.actions;
export default walletSlice.reducer;

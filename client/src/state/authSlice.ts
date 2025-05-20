import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../services/pocketbase';

// Custom Session type to replace Supabase Session
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: User | null;
}

// Define the state interface
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

// We're using direct actions instead of thunks for our simplified authentication

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.loading = false;
      state.error = null;
    },
  },
  // No extraReducers needed for our simplified authentication
});

// Export actions and reducer
export const { setUser, setSession, setLoading, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;

// Export the RootState type for use in components
export type RootState = {
  auth: AuthState;
};

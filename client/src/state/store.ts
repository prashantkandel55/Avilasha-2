import { configureStore, combineReducers } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
import authReducer from './authSlice';
import walletReducer from './walletSlice';
import portfolioReducer from './portfolioSlice';
import marketReducer from './marketSlice';
import transactionReducer from './transactionSlice';
import nftReducer from './nftSlice';
import tokenReducer from './tokenSlice';

// Create the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletReducer,
  portfolio: portfolioReducer,
  market: marketReducer,
  transactions: transactionReducer,
  nfts: nftReducer,
  tokens: tokenReducer,
});

// Configure the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // Allows non-serializable values in state
    }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks for useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

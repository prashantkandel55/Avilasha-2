import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../state/store';
import { clearAuth } from '../state/authSlice';
import { fetchWallets } from '../state/walletSlice';
import { fetchPortfolio } from '../state/portfolioSlice';
import { fetchTopCoins } from '../state/marketSlice';
import { fetchTransactions } from '../state/transactionSlice';
import { fetchNFTs } from '../state/nftSlice';
import WalletConnect from '../features/wallet/WalletConnect';
import PortfolioOverview from '../features/portfolio/PortfolioOverview';
import MarketOverview from '../features/market/MarketOverview';
import TransactionHistory from '../features/transaction/TransactionHistory';
import NFTGallery from '../features/nft/NFTGallery';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const handleSignOut = async () => {
    try {
      await dispatch(clearAuth());
      // The auth state listener will handle redirecting to login
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Fetch wallets, portfolio, market data, transactions, and NFTs when component mounts or user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchWallets());
      dispatch(fetchPortfolio());
      dispatch(fetchTopCoins(10));
      dispatch(fetchTransactions());
      dispatch(fetchNFTs());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Avilasha-2</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Profile</h2>
              
              {user && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <span className="font-medium">User ID:</span> {user.id}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Management Card */}
          <div className="lg:col-span-2">
            <WalletConnect />
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="mt-6">
          <PortfolioOverview />
        </div>
        
        {/* Market Overview */}
        <div className="mt-6">
          <MarketOverview />
        </div>
        
        {/* Transaction History */}
        <div className="mt-6">
          <TransactionHistory />
        </div>
        
        {/* NFT Gallery */}
        <div className="mt-6">
          <NFTGallery />
        </div>
        
        {/* Placeholder for future components */}
        <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Secure Storage via Electron will be added in future updates.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

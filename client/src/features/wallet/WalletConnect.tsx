import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { addWallet, removeWallet, fetchWallets, isValidEthereumAddress } from '../../state/walletSlice';
import { Wallet } from '../../types/Wallet';

const WalletConnect: React.FC = () => {
  const dispatch = useAppDispatch();
  const { wallets, status, error } = useAppSelector((state) => state.wallet);
  const { user } = useAppSelector((state) => state.auth);
  
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState('');
  
  // Fetch wallets when component mounts or user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchWallets());
    }
  }, [dispatch, user]);
  
  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation error
    setValidationError('');
    
    // Validate address
    if (!address) {
      setValidationError('Wallet address is required');
      return;
    }
    
    if (!isValidEthereumAddress(address)) {
      setValidationError('Invalid Ethereum address format. Must start with 0x followed by 40 hexadecimal characters.');
      return;
    }
    
    // Check if wallet already exists
    if (wallets.some(wallet => wallet.address.toLowerCase() === address.toLowerCase())) {
      setValidationError('This wallet is already connected');
      return;
    }
    
    // Create new wallet object
    const newWallet: Wallet = {
      address,
      name: name || `Wallet ${wallets.length + 1}`,
    };
    
    // Dispatch add wallet action
    try {
      await dispatch(addWallet(newWallet)).unwrap();
      
      // Reset form
      setAddress('');
      setName('');
    } catch (err: any) {
      setValidationError(err.message || 'Failed to add wallet');
    }
  };
  
  const handleRemoveWallet = async (walletId: string) => {
    if (window.confirm('Are you sure you want to remove this wallet?')) {
      try {
        await dispatch(removeWallet(walletId)).unwrap();
      } catch (err: any) {
        console.error('Failed to remove wallet:', err);
      }
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect Wallet</h2>
      
      {/* Add Wallet Form */}
      <form onSubmit={handleAddWallet} className="mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ethereum Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Wallet Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Main Wallet"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          {validationError && (
            <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
              {validationError}
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Connected Wallets List */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Connected Wallets</h3>
        
        {status === 'loading' && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">Loading wallets...</p>
          </div>
        )}
        
        {status !== 'loading' && wallets.length === 0 && (
          <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
            <p className="text-gray-600 dark:text-gray-400">No wallets connected yet</p>
          </div>
        )}
        
        {wallets.length > 0 && (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {wallets.map((wallet) => (
              <li key={wallet.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {wallet.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                      {wallet.address}
                    </p>
                  </div>
                  <button
                    onClick={() => wallet.id && handleRemoveWallet(wallet.id)}
                    className="ml-2 p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <span className="sr-only">Remove</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;

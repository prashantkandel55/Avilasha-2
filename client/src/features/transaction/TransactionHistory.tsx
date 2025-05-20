import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { fetchTransactions, setTypeFilter, setWalletFilter, setTokenFilter, resetFilters } from '../../state/transactionSlice';
import { Transaction, TransactionType } from '../../types/Transaction';

const TransactionHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredTransactions, transactions, filters, status, error } = useAppSelector((state) => state.transactions);
  const { wallets } = useAppSelector((state) => state.wallet);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'ascending' | 'descending' }>({
    key: 'timestamp',
    direction: 'descending'
  });
  
  // Fetch transactions when component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTransactions());
    }
  }, [dispatch, status]);
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format amount with token symbol
  const formatAmount = (amount: number, symbol: string): string => {
    return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${symbol}`;
  };
  
  // Get CSS class for transaction type
  const getTypeClass = (type: TransactionType): string => {
    switch (type) {
      case 'receive':
        return 'text-green-600 dark:text-green-400';
      case 'send':
        return 'text-red-600 dark:text-red-400';
      case 'swap':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  // Get icon for transaction type
  const getTypeIcon = (type: TransactionType): JSX.Element => {
    switch (type) {
      case 'receive':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        );
      case 'send':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-5a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 16.586V13z" clipRule="evenodd" />
          </svg>
        );
      case 'swap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
          </svg>
        );
      default:
        return <></>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string): JSX.Element => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'confirmed':
        bgColor = 'bg-green-100 dark:bg-green-900';
        textColor = 'text-green-800 dark:text-green-200';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900';
        textColor = 'text-yellow-800 dark:text-yellow-200';
        break;
      case 'failed':
        bgColor = 'bg-red-100 dark:bg-red-900';
        textColor = 'text-red-800 dark:text-red-200';
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-700';
        textColor = 'text-gray-800 dark:text-gray-200';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };
  
  // Handle sorting
  const requestSort = (key: keyof Transaction) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sorted transactions
  const getSortedTransactions = (): Transaction[] => {
    const sortableTransactions = [...filteredTransactions];
    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        const aValue = a[sortConfig.key] as string | number;
        const bValue = b[sortConfig.key] as string | number;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  };
  
  // Get sort direction indicator
  const getSortDirectionIndicator = (key: keyof Transaction): string => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };
  
  // Handle filter changes
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTypeFilter(e.target.value as TransactionType | 'all'));
  };
  
  const handleWalletFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setWalletFilter(e.target.value));
  };
  
  const handleTokenFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTokenFilter(e.target.value));
  };
  
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };
  
  // Get unique tokens from transactions
  const getUniqueTokens = (): string[] => {
    const tokenSet = new Set<string>();
    transactions.forEach(tx => {
      tokenSet.add(tx.token_symbol);
    });
    return Array.from(tokenSet);
  };
  
  // Truncate address
  const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (status === 'loading' && transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction History</h2>
        </div>
        <div className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction History</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {status === 'failed' && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
          {error || 'Failed to load transaction data'}
        </div>
      )}
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={handleTypeFilterChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="receive">Receive</option>
            <option value="send">Send</option>
            <option value="swap">Swap</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="wallet-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wallet
          </label>
          <select
            id="wallet-filter"
            value={filters.wallet}
            onChange={handleWalletFilterChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Wallets</option>
            {wallets?.map(wallet => (
              <option key={wallet.id} value={wallet.address}>
                {truncateAddress(wallet.address)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="token-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Token
          </label>
          <select
            id="token-filter"
            value={filters.token}
            onChange={handleTokenFilterChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Tokens</option>
            {getUniqueTokens().map(token => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Transaction Table */}
      {filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('type')}
                >
                  Type {getSortDirectionIndicator('type')}
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('timestamp')}
                >
                  Date {getSortDirectionIndicator('timestamp')}
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('token_symbol')}
                >
                  Token {getSortDirectionIndicator('token_symbol')}
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('amount')}
                >
                  Amount {getSortDirectionIndicator('amount')}
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  Status {getSortDirectionIndicator('status')}
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {getSortedTransactions().map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(tx.type)}
                      <span className={`ml-2 ${getTypeClass(tx.type)}`}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(tx.timestamp)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {tx.token_symbol}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatAmount(tx.amount, tx.token_symbol.split(' ')[0])}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title={`View details for transaction ${tx.tx_hash}`}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>
    </div>
  );
};

export default TransactionHistory;

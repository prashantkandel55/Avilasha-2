import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { fetchTopCoins } from '../../state/marketSlice';
import { MarketCoin } from '../../types/Market';

const MarketOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { coins, status, error, lastUpdated } = useAppSelector((state) => state.market);
  const [refreshInterval, setRefreshInterval] = useState<number>(60000); // 1 minute by default
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Get CSS class for change value
  const getChangeClass = (change: number | undefined): string => {
    if (change === undefined) return 'text-gray-500 dark:text-gray-400';
    return change >= 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };
  
  // Format last updated time
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return 'Never updated';
    
    const date = new Date(lastUpdated);
    return date.toLocaleTimeString();
  };
  
  // Fetch market data
  const fetchMarketData = () => {
    dispatch(fetchTopCoins(10));
  };
  
  // Initial fetch and setup auto-refresh
  useEffect(() => {
    fetchMarketData();
    
    // Set up auto-refresh
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchMarketData();
      }, refreshInterval);
    }
    
    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [dispatch, autoRefresh, refreshInterval]);
  
  // Handle refresh interval change
  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = parseInt(e.target.value);
    setRefreshInterval(newInterval);
  };
  
  // Handle auto-refresh toggle
  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };
  
  // Handle manual refresh
  const handleManualRefresh = () => {
    fetchMarketData();
  };
  
  if (status === 'loading' && coins.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Market Overview</h2>
        </div>
        <div className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Market Overview</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center">
            <label htmlFor="refresh-interval" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
              Refresh:
            </label>
            <select
              id="refresh-interval"
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
              <option value={300000}>5m</option>
              <option value={600000}>10m</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="auto-refresh" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
              Auto:
            </label>
            <div className="relative inline-block w-10 align-middle select-none">
              <input
                type="checkbox"
                id="auto-refresh"
                checked={autoRefresh}
                onChange={handleAutoRefreshToggle}
                className="sr-only"
              />
              <div className={`block w-10 h-6 rounded-full ${autoRefresh ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoRefresh ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </div>
          
          <button
            onClick={handleManualRefresh}
            disabled={status === 'loading'}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${status === 'loading' ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      {status === 'failed' && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
          {error || 'Failed to load market data'}
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Last updated: {formatLastUpdated()}
        {status === 'loading' && coins.length > 0 && (
          <span className="ml-2 inline-block">
            <svg className="animate-spin h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
      </div>
      
      {coins.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Coin
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  24h %
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {coins.map((coin: MarketCoin) => (
                <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {coin.market_cap_rank}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {coin.image && (
                        <img 
                          src={coin.image} 
                          alt={coin.name} 
                          className="w-6 h-6 mr-2"
                          onError={(e) => {
                            // Handle image load error
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {coin.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatCurrency(coin.current_price)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-right text-sm ${getChangeClass(coin.price_change_percentage_24h)}`}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                      compactDisplay: 'short',
                      maximumFractionDigits: 2
                    }).format(coin.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <p className="text-gray-600 dark:text-gray-400">No market data available</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Data provided by CoinGecko API
      </div>
    </div>
  );
};

export default MarketOverview;

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { fetchPortfolio } from '../../state/portfolioSlice';

const PortfolioOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assets, totalValue, totalChange24h, status, error } = useAppSelector((state) => state.portfolio);
  const { user } = useAppSelector((state) => state.auth);
  
  // Fetch portfolio when component mounts or user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchPortfolio());
    }
  }, [dispatch, user]);
  
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
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Get CSS class for change value
  const getChangeClass = (change: number): string => {
    return change >= 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };
  
  if (status === 'loading') {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
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
  
  if (status === 'failed') {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio</h2>
        <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
          {error || 'Failed to load portfolio data'}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio</h2>
      
      {/* Portfolio Summary */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </h3>
          <span className={`ml-2 text-sm font-medium ${getChangeClass(totalChange24h)}`}>
            {formatPercentage(totalChange24h)} (24h)
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Total Portfolio Value
        </p>
      </div>
      
      {/* Assets Table */}
      {assets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Holdings
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  24h
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {asset.imageUrl && (
                        <img 
                          src={asset.imageUrl} 
                          alt={asset.name} 
                          className="w-6 h-6 mr-2"
                          onError={(e) => {
                            // Handle image load error
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {asset.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatCurrency(asset.price)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {asset.amount} {asset.symbol}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatCurrency(asset.value || 0)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-right text-sm ${getChangeClass(asset.change24h || 0)}`}>
                    {formatPercentage(asset.change24h || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <p className="text-gray-600 dark:text-gray-400">No assets in portfolio</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioOverview;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../state/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchTokens, 
  setSearchQuery, 
  setSortBy, 
  setPage, 
  selectToken 
} from '../state/tokenSlice';
import { Token } from '../types/Token';
import { 
  FiSearch, 
  FiArrowUp, 
  FiArrowDown,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiFilter
} from 'react-icons/fi';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import Skeleton from './ui/Skeleton';

const TokenList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { 
    filteredTokens, 
    loading, 
    error, 
    searchQuery, 
    sortBy, 
    sortDirection,
    page,
    pageSize,
    totalPages
  } = useAppSelector(state => state.tokens);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchTokens());
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSort = (column: string) => {
    dispatch(setSortBy(column));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleTokenSelect = (token: Token) => {
    dispatch(selectToken(token.id));
    navigate(`/token-explorer/${token.id}`);
  };

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedTokens = filteredTokens.slice(startIndex, endIndex);

  // Format numbers with commas and fixed decimal places
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Format large numbers with abbreviations (K, M, B)
  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  // Get sort indicator
  const getSortIndicator = (column: string) => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />;
    }
    return null;
  };

  if (loading && !isInitialized) {
    return (
      <Card animate variant="glass" className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-6 w-6" variant="circle" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/30 border border-red-700 text-red-300 px-6 py-4 rounded-lg shadow-lg" 
        role="alert"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-900/50">
              <svg className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-300">Error loading tokens</h3>
            <div className="mt-2 text-sm text-red-200">
              <p>{error}</p>
            </div>
            <Button 
              variant="danger" 
              size="sm"
              className="mt-3"
              onClick={() => dispatch(fetchTokens())}
              leftIcon={<FiRefreshCw />}
            >
              Try Again
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card animate variant="glass" className="p-6">
      <div className="flex flex-col space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Token Explorer</h2>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full md:w-64"
                leftIcon={<FiSearch />}
              />
              <Button
                variant="secondary"
                size="md"
                leftIcon={<FiFilter />}
                className="whitespace-nowrap"
              >
                Filter
              </Button>
            </div>
          </div>
        </motion.div>

        {filteredTokens.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 px-6 bg-dark-800/50 rounded-lg border border-gray-800"
          >
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-white">No tokens found</h3>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => dispatch(setSearchQuery(''))}
            >
              Clear Search
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto rounded-lg border border-gray-800">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-dark-800">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors hover:text-avilasha-400"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        <span>Token</span>
                        {getSortIndicator('name')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors hover:text-avilasha-400"
                      onClick={() => handleSort('current_price')}
                    >
                      <div className="flex items-center">
                        <span>Price</span>
                        {getSortIndicator('current_price')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors hover:text-avilasha-400"
                      onClick={() => handleSort('price_change_percentage_24h')}
                    >
                      <div className="flex items-center">
                        <span>24h %</span>
                        {getSortIndicator('price_change_percentage_24h')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors hover:text-avilasha-400"
                      onClick={() => handleSort('market_cap')}
                    >
                      <div className="flex items-center">
                        <span>Market Cap</span>
                        {getSortIndicator('market_cap')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors hover:text-avilasha-400"
                      onClick={() => handleSort('total_volume')}
                    >
                      <div className="flex items-center">
                        <span>Volume (24h)</span>
                        {getSortIndicator('total_volume')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-900 divide-y divide-gray-800">
                  <AnimatePresence>
                    {displayedTokens.map((token) => (
                      <motion.tr 
                        key={token.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        className="cursor-pointer transition-colors hover:bg-gray-800/50"
                        onClick={() => handleTokenSelect(token)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={typeof token.image === 'string' ? token.image : token.image.thumb} 
                              alt={token.name} 
                              className="w-8 h-8 mr-3 rounded-full bg-gray-800 p-1"
                            />
                            <div>
                              <div className="text-sm font-medium text-white">{token.name}</div>
                              <div className="text-xs text-gray-400">{token.symbol.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          ${formatNumber(token.current_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={token.price_change_percentage_24h >= 0 ? 'success' : 'danger'}
                            size="sm"
                            glow
                          >
                            {token.price_change_percentage_24h >= 0 ? '+' : ''}{formatNumber(token.price_change_percentage_24h)}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatLargeNumber(token.market_cap)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatLargeNumber(token.total_volume)}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {filteredTokens.length > 0 && (
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{startIndex + 1}-{Math.min(endIndex, filteredTokens.length)}</span> of <span className="font-medium text-white">{filteredTokens.length}</span> tokens
            </div>
            <div className="flex space-x-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-2"
              >
                <FiChevronLeft />
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={i}
                    variant={page === pageNum ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="min-w-[2.5rem]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-2"
              >
                <FiChevronRight />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default TokenList;

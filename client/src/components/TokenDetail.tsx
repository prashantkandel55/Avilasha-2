import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../state/store';
import { fetchTokenDetails, clearSelectedToken } from '../state/tokenSlice';
import { FiArrowLeft, FiExternalLink, FiInfo, FiDollarSign, FiBarChart2, FiActivity } from 'react-icons/fi';

const TokenDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedToken, loading, error } = useAppSelector(state => state.tokens);

  useEffect(() => {
    if (id) {
      dispatch(fetchTokenDetails(id));
    }

    return () => {
      dispatch(clearSelectedToken());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/token-explorer');
  };

  // Format numbers with commas and fixed decimal places
  const formatNumber = (num: number | undefined, decimals = 2) => {
    if (num === undefined) return 'N/A';
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Format large numbers with abbreviations (K, M, B)
  const formatLargeNumber = (num: number | undefined) => {
    if (num === undefined) return 'N/A';
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

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!selectedToken) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <p>Token not found. Please select a token from the list.</p>
        <button 
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-150"
        >
          Back to Token List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <button 
        onClick={handleBack}
        className="flex items-center text-green-500 hover:text-green-400 mb-6 transition duration-150"
      >
        <FiArrowLeft className="mr-2" /> Back to Token List
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src={selectedToken.image?.large || selectedToken.image} 
            alt={selectedToken.name} 
            className="w-12 h-12 mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{selectedToken.name}</h1>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">{selectedToken.symbol?.toUpperCase()}</span>
              {selectedToken.links?.homepage?.[0] && (
                <a 
                  href={selectedToken.links.homepage[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400 flex items-center"
                >
                  <FiExternalLink className="ml-1" size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold">
            ${formatNumber(selectedToken.market_data?.current_price?.usd || selectedToken.current_price)}
          </div>
          <div className={`flex items-center ${
            (selectedToken.market_data?.price_change_percentage_24h || selectedToken.price_change_percentage_24h || 0) >= 0 
              ? 'text-green-500' 
              : 'text-red-500'
          }`}>
            {(selectedToken.market_data?.price_change_percentage_24h || selectedToken.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
            {formatNumber(selectedToken.market_data?.price_change_percentage_24h || selectedToken.price_change_percentage_24h)}%
            <span className="text-gray-400 ml-1">(24h)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center text-gray-400 mb-2">
            <FiInfo className="mr-2" /> Rank
          </div>
          <div className="text-xl font-semibold">
            #{selectedToken.market_cap_rank || 'N/A'}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center text-gray-400 mb-2">
            <FiDollarSign className="mr-2" /> Market Cap
          </div>
          <div className="text-xl font-semibold">
            {formatLargeNumber(selectedToken.market_data?.market_cap?.usd || selectedToken.market_cap)}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center text-gray-400 mb-2">
            <FiBarChart2 className="mr-2" /> 24h Volume
          </div>
          <div className="text-xl font-semibold">
            {formatLargeNumber(selectedToken.market_data?.total_volume?.usd || selectedToken.total_volume)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiActivity className="mr-2" /> Price Statistics
          </h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="py-3 text-gray-400">All Time High</td>
                <td className="py-3 text-right">
                  ${formatNumber(selectedToken.market_data?.ath?.usd || selectedToken.ath)}
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedToken.market_data?.ath_date?.usd || selectedToken.ath_date)}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-3 text-gray-400">All Time Low</td>
                <td className="py-3 text-right">
                  ${formatNumber(selectedToken.market_data?.atl?.usd || selectedToken.atl)}
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedToken.market_data?.atl_date?.usd || selectedToken.atl_date)}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-3 text-gray-400">24h High</td>
                <td className="py-3 text-right">
                  ${formatNumber(selectedToken.market_data?.high_24h?.usd || selectedToken.high_24h)}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-400">24h Low</td>
                <td className="py-3 text-right">
                  ${formatNumber(selectedToken.market_data?.low_24h?.usd || selectedToken.low_24h)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiInfo className="mr-2" /> Supply Information
          </h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="py-3 text-gray-400">Circulating Supply</td>
                <td className="py-3 text-right">
                  {formatNumber(selectedToken.market_data?.circulating_supply || selectedToken.circulating_supply, 0)}
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-3 text-gray-400">Total Supply</td>
                <td className="py-3 text-right">
                  {formatNumber(selectedToken.market_data?.total_supply || selectedToken.total_supply, 0)}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-400">Max Supply</td>
                <td className="py-3 text-right">
                  {selectedToken.market_data?.max_supply || selectedToken.max_supply 
                    ? formatNumber(selectedToken.market_data?.max_supply || selectedToken.max_supply, 0) 
                    : 'Unlimited'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {selectedToken.description?.en && (
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">About {selectedToken.name}</h3>
          <div 
            className="text-gray-300 prose prose-sm max-w-none prose-headings:text-white prose-a:text-green-500"
            dangerouslySetInnerHTML={{ __html: selectedToken.description.en }}
          />
        </div>
      )}
    </div>
  );
};

export default TokenDetail;

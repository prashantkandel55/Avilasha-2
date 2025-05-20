import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { fetchNFTs, selectNFT, clearSelectedNFT } from '../../state/nftSlice';
import { NFT } from '../../types/NFT';

const NFTGallery: React.FC = () => {
  const dispatch = useAppDispatch();
  const { nfts, selectedNFT, status, error } = useAppSelector((state) => state.nfts);
  const { user } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Fetch NFTs when component mounts
  useEffect(() => {
    if (status === 'idle' && user) {
      dispatch(fetchNFTs());
    }
  }, [dispatch, status, user]);
  
  // Handle NFT selection
  const handleNFTClick = (nftId: string) => {
    dispatch(selectNFT(nftId));
    setIsModalOpen(true);
  };
  
  // Close modal and clear selected NFT
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      dispatch(clearSelectedNFT());
    }, 300); // Delay clearing to allow modal animation
  };
  
  // Format price with ETH symbol
  const formatPrice = (price: number | undefined): string => {
    if (!price) return 'N/A';
    return `${price.toFixed(2)} ETH`;
  };
  
  // Render NFT modal
  const renderNFTModal = () => {
    if (!selectedNFT) return null;
    
    return (
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleCloseModal}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* NFT Image */}
          <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <img 
              src={selectedNFT.image} 
              alt={selectedNFT.name}
              className="max-w-full max-h-[50vh] object-contain rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Available';
              }}
            />
          </div>
          
          {/* NFT Details */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedNFT.name}</h3>
                <div className="flex items-center mt-1">
                  {selectedNFT.collection.image && (
                    <img 
                      src={selectedNFT.collection.image} 
                      alt={selectedNFT.collection.name}
                      className="w-5 h-5 rounded-full mr-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">{selectedNFT.collection.name}</span>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {selectedNFT.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs text-gray-500 dark:text-gray-400">Token ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedNFT.token_id}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs text-gray-500 dark:text-gray-400">Standard</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedNFT.token_standard}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs text-gray-500 dark:text-gray-400">Blockchain</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{selectedNFT.blockchain}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Sale</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(selectedNFT.last_sale_price)}</p>
              </div>
            </div>
            
            {selectedNFT.traits && selectedNFT.traits.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Traits</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedNFT.traits.map((trait, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                      <p className="text-xs text-blue-500 dark:text-blue-400">{trait.trait_type}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{trait.value.toString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contract Address</h4>
              <div className="flex items-center">
                <code className="text-xs bg-gray-100 dark:bg-gray-900 p-1 rounded text-gray-800 dark:text-gray-200 flex-1 overflow-hidden text-ellipsis">
                  {selectedNFT.contract_address}
                </code>
                <button 
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => navigator.clipboard.writeText(selectedNFT.contract_address)}
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render loading state
  if (status === 'loading' && nfts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">NFT Gallery</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-600"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">NFT Gallery</h2>
        {status === 'loading' && nfts.length > 0 && (
          <span className="inline-flex items-center">
            <svg className="animate-spin h-4 w-4 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">Refreshing...</span>
          </span>
        )}
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {nfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft: NFT) => (
            <div 
              key={nft.id} 
              className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleNFTClick(nft.id)}
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Available';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">{nft.name}</h3>
                <div className="flex items-center">
                  {nft.collection.image && (
                    <img 
                      src={nft.collection.image} 
                      alt={nft.collection.name}
                      className="w-4 h-4 rounded-full mr-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{nft.collection.name}</p>
                </div>
                {nft.last_sale_price && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Last sale: {formatPrice(nft.last_sale_price)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">No NFTs found in your collection</p>
          <button
            onClick={() => dispatch(fetchNFTs())}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh Gallery
          </button>
        </div>
      )}
      
      {/* NFT Detail Modal */}
      {renderNFTModal()}
    </div>
  );
};

export default NFTGallery;

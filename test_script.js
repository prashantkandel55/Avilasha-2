/**
 * Avilasha-2 Test Script
 * 
 * This script contains helper functions to test various aspects of the application.
 * It can be run in the browser console when the app is running.
 */

/**
 * Test authentication flows
 */
const testAuth = {
  // Test login form validation
  testLoginValidation: () => {
    try {
      const emailInput = document.querySelector('input[type="email"]');
      const submitButton = document.querySelector('button[type="submit"]');
      
      if (!emailInput || !submitButton) {
        console.error('Login form elements not found');
        return false;
      }
      
      // Test empty email
      emailInput.value = '';
      submitButton.click();
      console.log('Empty email test passed if validation error is shown');
      
      // Test invalid email format
      emailInput.value = 'invalid-email';
      submitButton.click();
      console.log('Invalid email format test passed if validation error is shown');
      
      // Test valid email format (but don't actually submit)
      emailInput.value = 'test@example.com';
      console.log('Valid email format ready for submission');
      
      return true;
    } catch (error) {
      console.error('Error testing login validation:', error);
      return false;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    try {
      // Check Redux store for auth state
      const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
        window.__REDUX_DEVTOOLS_EXTENSION__.liftedState.computedStates.slice(-1)[0].state : 
        null;
      
      if (state && state.auth && state.auth.user) {
        console.log('User is authenticated:', state.auth.user.email);
        return true;
      } else {
        console.log('User is not authenticated');
        return false;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
};

/**
 * Test wallet management
 */
const testWallets = {
  // Test wallet validation
  testWalletValidation: () => {
    try {
      const walletInput = document.querySelector('input[placeholder*="wallet" i]');
      const addButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.toLowerCase().includes('add'));
      
      if (!walletInput || !addButton) {
        console.error('Wallet form elements not found');
        return false;
      }
      
      // Test empty address
      walletInput.value = '';
      addButton.click();
      console.log('Empty wallet test passed if validation error is shown');
      
      // Test invalid address format
      walletInput.value = '0xinvalid';
      addButton.click();
      console.log('Invalid wallet format test passed if validation error is shown');
      
      // Test valid address format (but don't actually submit)
      walletInput.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      console.log('Valid wallet format ready for submission');
      
      return true;
    } catch (error) {
      console.error('Error testing wallet validation:', error);
      return false;
    }
  },
  
  // Count connected wallets
  countWallets: () => {
    try {
      // Check Redux store for wallet state
      const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
        window.__REDUX_DEVTOOLS_EXTENSION__.liftedState.computedStates.slice(-1)[0].state : 
        null;
      
      if (state && state.wallet && state.wallet.wallets) {
        console.log('Connected wallets:', state.wallet.wallets.length);
        return state.wallet.wallets.length;
      } else {
        console.log('No wallets found or wallet state not available');
        return 0;
      }
    } catch (error) {
      console.error('Error counting wallets:', error);
      return 0;
    }
  }
};

/**
 * Test portfolio analytics
 */
const testPortfolio = {
  // Check if portfolio data is loaded
  isPortfolioLoaded: () => {
    try {
      // Check Redux store for portfolio state
      const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
        window.__REDUX_DEVTOOLS_EXTENSION__.liftedState.computedStates.slice(-1)[0].state : 
        null;
      
      if (state && state.portfolio && state.portfolio.assets) {
        console.log('Portfolio assets loaded:', state.portfolio.assets.length);
        console.log('Total portfolio value:', state.portfolio.totalValue);
        return state.portfolio.assets.length > 0;
      } else {
        console.log('No portfolio data found or portfolio state not available');
        return false;
      }
    } catch (error) {
      console.error('Error checking portfolio:', error);
      return false;
    }
  }
};

/**
 * Test market data
 */
const testMarket = {
  // Check if market data is loaded
  isMarketDataLoaded: () => {
    try {
      // Check Redux store for market state
      const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
        window.__REDUX_DEVTOOLS_EXTENSION__.liftedState.computedStates.slice(-1)[0].state : 
        null;
      
      if (state && state.market && state.market.coins) {
        console.log('Market coins loaded:', state.market.coins.length);
        console.log('Last updated:', state.market.lastUpdated);
        return state.market.coins.length > 0;
      } else {
        console.log('No market data found or market state not available');
        return false;
      }
    } catch (error) {
      console.error('Error checking market data:', error);
      return false;
    }
  },
  
  // Test manual refresh
  testManualRefresh: () => {
    try {
      const refreshButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.querySelector('svg[viewBox="0 0 24 24"]'));
      
      if (!refreshButton) {
        console.error('Refresh button not found');
        return false;
      }
      
      refreshButton.click();
      console.log('Manual refresh triggered');
      
      return true;
    } catch (error) {
      console.error('Error testing manual refresh:', error);
      return false;
    }
  }
};

/**
 * Test transaction history
 */
const testTransactions = {
  // Check if transaction data is loaded
  isTransactionDataLoaded: () => {
    try {
      // Check Redux store for transaction state
      const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
        window.__REDUX_DEVTOOLS_EXTENSION__.liftedState.computedStates.slice(-1)[0].state : 
        null;
      
      if (state && state.transactions && state.transactions.transactions) {
        console.log('Transactions loaded:', state.transactions.transactions.length);
        return state.transactions.transactions.length > 0;
      } else {
        console.log('No transaction data found or transaction state not available');
        return false;
      }
    } catch (error) {
      console.error('Error checking transaction data:', error);
      return false;
    }
  },
  
  // Test transaction filters
  testTransactionFilters: () => {
    try {
      const typeFilter = document.querySelector('select#type-filter');
      const walletFilter = document.querySelector('select#wallet-filter');
      const tokenFilter = document.querySelector('select#token-filter');
      
      if (!typeFilter || !walletFilter || !tokenFilter) {
        console.error('Transaction filter elements not found');
        return false;
      }
      
      // Test type filter
      typeFilter.value = 'receive';
      typeFilter.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('Type filter set to "receive"');
      
      // Test wallet filter
      if (walletFilter.options.length > 1) {
        walletFilter.value = walletFilter.options[1].value;
        walletFilter.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('Wallet filter set to:', walletFilter.options[1].text);
      }
      
      // Test token filter
      if (tokenFilter.options.length > 1) {
        tokenFilter.value = tokenFilter.options[1].value;
        tokenFilter.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('Token filter set to:', tokenFilter.options[1].text);
      }
      
      // Reset filters
      const resetButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.toLowerCase().includes('reset'));
      
      if (resetButton) {
        resetButton.click();
        console.log('Filters reset');
      }
      
      return true;
    } catch (error) {
      console.error('Error testing transaction filters:', error);
      return false;
    }
  }
};

/**
 * Test NFT gallery
 */
const testNFTs = {
  // Check if NFT data is loaded
  isNFTDataLoaded: () => {
    try {
      // Check Redux store for NFT state
      const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
        window.__REDUX_DEVTOOLS_EXTENSION__.liftedState.computedStates.slice(-1)[0].state : 
        null;
      
      if (state && state.nfts && state.nfts.nfts) {
        console.log('NFTs loaded:', state.nfts.nfts.length);
        return state.nfts.nfts.length > 0;
      } else {
        console.log('No NFT data found or NFT state not available');
        return false;
      }
    } catch (error) {
      console.error('Error checking NFT data:', error);
      return false;
    }
  },
  
  // Test NFT detail modal
  testNFTDetailModal: () => {
    try {
      const nftItems = document.querySelectorAll('[class*="grid"] > [class*="rounded"]');
      
      if (!nftItems || nftItems.length === 0) {
        console.error('NFT items not found');
        return false;
      }
      
      // Click the first NFT to open the modal
      nftItems[0].click();
      console.log('NFT detail modal should be open');
      
      // Wait a bit and then try to close the modal
      setTimeout(() => {
        const closeButton = document.querySelector('button svg[stroke="currentColor"][viewBox="0 0 24 24"]');
        if (closeButton) {
          closeButton.parentElement.click();
          console.log('NFT detail modal closed');
        }
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error testing NFT detail modal:', error);
      return false;
    }
  }
};

/**
 * Test secure storage
 */
const testSecureStorage = {
  // Check if secure storage is available
  isSecureStorageAvailable: () => {
    try {
      return window.electron && window.electron.secureStore !== undefined;
    } catch (error) {
      console.error('Error checking secure storage availability:', error);
      return false;
    }
  }
};

/**
 * Run all tests
 */
const runAllTests = async () => {
  console.log('=== AVILASHA-2 TEST SUITE ===');
  
  console.log('\n--- Authentication Tests ---');
  console.log('Is Authenticated:', testAuth.isAuthenticated());
  
  if (!testAuth.isAuthenticated()) {
    console.log('Login Validation:', testAuth.testLoginValidation());
  }
  
  console.log('\n--- Wallet Tests ---');
  console.log('Wallet Count:', testWallets.countWallets());
  console.log('Wallet Validation:', testWallets.testWalletValidation());
  
  console.log('\n--- Portfolio Tests ---');
  console.log('Portfolio Loaded:', testPortfolio.isPortfolioLoaded());
  
  console.log('\n--- Market Data Tests ---');
  console.log('Market Data Loaded:', testMarket.isMarketDataLoaded());
  console.log('Manual Refresh:', testMarket.testManualRefresh());
  
  console.log('\n--- Transaction Tests ---');
  console.log('Transaction Data Loaded:', testTransactions.isTransactionDataLoaded());
  console.log('Transaction Filters:', testTransactions.testTransactionFilters());
  
  console.log('\n--- NFT Tests ---');
  console.log('NFT Data Loaded:', testNFTs.isNFTDataLoaded());
  console.log('NFT Detail Modal:', testNFTs.testNFTDetailModal());
  
  console.log('\n--- Secure Storage Tests ---');
  console.log('Secure Storage Available:', testSecureStorage.isSecureStorageAvailable());
  
  console.log('\n=== TEST SUITE COMPLETE ===');
};

// Export test functions
window.avilashaTests = {
  auth: testAuth,
  wallets: testWallets,
  portfolio: testPortfolio,
  market: testMarket,
  transactions: testTransactions,
  nfts: testNFTs,
  secureStorage: testSecureStorage,
  runAll: runAllTests
};

console.log('Avilasha-2 test script loaded. Run tests with window.avilashaTests.runAll()');

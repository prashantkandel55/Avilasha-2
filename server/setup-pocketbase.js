const axios = require('axios');

// PocketBase API endpoint
const PB_URL = 'http://localhost:8090/api';

// Demo user credentials
const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'password';

// Function to authenticate as demo user
async function authenticateDemoUser() {
  try {
    console.log('Authenticating as demo user...');
    const response = await axios.post(`${PB_URL}/collections/users/auth-with-password`, {
      identity: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    
    console.log('Demo user authentication successful');
    return {
      userId: response.data.record.id,
      token: response.data.token
    };
  } catch (error) {
    console.error('Demo user authentication failed:', error.response?.data || error.message);
    return null;
  }
}

// Function to create tokens collection
async function createTokensCollection() {
  try {
    console.log('Creating tokens collection...');
    
    // Create the collection
    await axios.post(`${PB_URL}/collections`, {
      name: 'tokens',
      type: 'base',
      schema: [
        {
          name: 'symbol',
          type: 'text',
          required: true
        },
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'image',
          type: 'text',
          required: true
        },
        {
          name: 'current_price',
          type: 'number',
          required: true
        },
        {
          name: 'market_cap',
          type: 'number',
          required: true
        },
        {
          name: 'market_cap_rank',
          type: 'number',
          required: true
        },
        {
          name: 'price_change_percentage_24h',
          type: 'number',
          required: true
        },
        {
          name: 'is_favorite',
          type: 'bool',
          default: false
        }
      ]
    });
    
    console.log('Tokens collection created successfully');
    return true;
  } catch (error) {
    if (error.response?.data?.code === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('Tokens collection already exists, skipping...');
      return true;
    } else {
      console.error('Error creating tokens collection:', error.response?.data || error.message);
      console.log('\nTo create the tokens collection manually:');
      console.log('1. Go to http://localhost:8090/_/');
      console.log('2. Click on "Collections" in the sidebar');
      console.log('3. Click "New collection"');
      console.log('4. Name: "tokens", Type: "Base collection"');
      console.log('5. Click "Create"');
      console.log('6. Add the following fields:');
      console.log('   - symbol (Text, Required)');
      console.log('   - name (Text, Required)');
      console.log('   - image (Text, Required)');
      console.log('   - current_price (Number, Required)');
      console.log('   - market_cap (Number, Required)');
      console.log('   - market_cap_rank (Number, Required)');
      console.log('   - price_change_percentage_24h (Number, Required)');
      console.log('   - is_favorite (Boolean, Default: false)');
      return false;
    }
  }
}

// Function to create portfolio collection
async function createPortfolioCollection() {
  try {
    console.log('Creating portfolio collection...');
    
    // Create the collection
    await axios.post(`${PB_URL}/collections`, {
      name: 'portfolio',
      type: 'base',
      schema: [
        {
          name: 'token_symbol',
          type: 'text',
          required: true
        },
        {
          name: 'amount',
          type: 'number',
          required: true
        },
        {
          name: 'purchase_price',
          type: 'number',
          required: true
        },
        {
          name: 'purchase_date',
          type: 'date',
          required: true
        }
      ]
    });
    
    console.log('Portfolio collection created successfully');
    return true;
  } catch (error) {
    if (error.response?.data?.code === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('Portfolio collection already exists, skipping...');
      return true;
    } else {
      console.error('Error creating portfolio collection:', error.response?.data || error.message);
      console.log('\nTo create the portfolio collection manually:');
      console.log('1. Go to http://localhost:8090/_/');
      console.log('2. Click on "Collections" in the sidebar');
      console.log('3. Click "New collection"');
      console.log('4. Name: "portfolio", Type: "Base collection"');
      console.log('5. Click "Create"');
      console.log('6. Add the following fields:');
      console.log('   - token_symbol (Text, Required)');
      console.log('   - amount (Number, Required)');
      console.log('   - purchase_price (Number, Required)');
      console.log('   - purchase_date (Date, Required)');
      return false;
    }
  }
}

// Function to create transactions collection
async function createTransactionsCollection() {
  try {
    console.log('Creating transactions collection...');
    
    // Create the collection
    await axios.post(`${PB_URL}/collections`, {
      name: 'transactions',
      type: 'base',
      schema: [
        {
          name: 'token_symbol',
          type: 'text',
          required: true
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: {
            values: ["buy", "sell", "transfer_in", "transfer_out"]
          }
        },
        {
          name: 'amount',
          type: 'number',
          required: true
        },
        {
          name: 'price',
          type: 'number',
          required: true
        },
        {
          name: 'fee',
          type: 'number',
          required: false,
          default: 0
        },
        {
          name: 'date',
          type: 'date',
          required: true
        },
        {
          name: 'notes',
          type: 'text',
          required: false
        }
      ]
    });
    
    console.log('Transactions collection created successfully');
    return true;
  } catch (error) {
    if (error.response?.data?.code === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('Transactions collection already exists, skipping...');
      return true;
    } else {
      console.error('Error creating transactions collection:', error.response?.data || error.message);
      return false;
    }
  }
}

// Function to create wallets collection
async function createWalletsCollection() {
  try {
    console.log('Creating wallets collection...');
    
    // Create the collection
    await axios.post(`${PB_URL}/collections`, {
      name: 'wallets',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: {
            values: ["hot", "cold", "exchange", "other"]
          }
        },
        {
          name: 'address',
          type: 'text',
          required: false
        },
        {
          name: 'balance',
          type: 'number',
          required: true,
          default: 0
        },
        {
          name: 'is_default',
          type: 'bool',
          required: false,
          default: false
        }
      ]
    });
    
    console.log('Wallets collection created successfully');
    return true;
  } catch (error) {
    if (error.response?.data?.code === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('Wallets collection already exists, skipping...');
      return true;
    } else {
      console.error('Error creating wallets collection:', error.response?.data || error.message);
      return false;
    }
  }
}

// Function to create notifications collection
async function createNotificationsCollection() {
  try {
    console.log('Creating notifications collection...');
    
    // Create the collection
    await axios.post(`${PB_URL}/collections`, {
      name: 'notifications',
      type: 'base',
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'message',
          type: 'text',
          required: true
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: {
            values: ["info", "success", "warning", "error"]
          }
        },
        {
          name: 'is_read',
          type: 'bool',
          required: false,
          default: false
        },
        {
          name: 'link',
          type: 'text',
          required: false
        }
      ]
    });
    
    console.log('Notifications collection created successfully');
    return true;
  } catch (error) {
    if (error.response?.data?.code === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('Notifications collection already exists, skipping...');
      return true;
    } else {
      console.error('Error creating notifications collection:', error.response?.data || error.message);
      return false;
    }
  }
}

// Function to fetch sample token data from CoinGecko
async function fetchSampleTokens() {
  try {
    console.log('Fetching sample tokens from CoinGecko...');
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false,
        },
      }
    );
    
    console.log(`Retrieved ${response.data.length} tokens from CoinGecko`);
    return response.data.map(token => ({
      symbol: token.symbol,
      name: token.name,
      image: token.image,
      current_price: token.current_price,
      market_cap: token.market_cap,
      market_cap_rank: token.market_cap_rank,
      price_change_percentage_24h: token.price_change_percentage_24h || 0,
      is_favorite: false
    }));
  } catch (error) {
    console.error('Error fetching sample tokens:', error.message);
    return [];
  }
}

// Function to populate tokens collection
async function populateTokens(userId, token) {
  const tokens = await fetchSampleTokens();
  if (tokens.length === 0) {
    console.log('No tokens fetched, skipping token population');
    return;
  }
  
  console.log(`Adding ${tokens.length} tokens to the database...`);
  let addedCount = 0;
  
  for (const tokenData of tokens) {
    try {
      await axios.post(
        `${PB_URL}/collections/tokens/records`,
        tokenData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        }
      );
      addedCount++;
      
      // Log progress every 10 tokens
      if (addedCount % 10 === 0) {
        console.log(`Added ${addedCount}/${tokens.length} tokens...`);
      }
    } catch (error) {
      console.error(`Error adding token ${tokenData.name}:`, error.response?.data || error.message);
    }
  }
  
  console.log(`Successfully added ${addedCount} tokens to the database`);
}

// Main function
async function main() {
  try {
    console.log('Starting PocketBase setup...');
    
    // Create collections
    const tokensCreated = await createTokensCollection();
    const portfolioCreated = await createPortfolioCollection();
    const transactionsCreated = await createTransactionsCollection();
    const walletsCreated = await createWalletsCollection();
    const notificationsCreated = await createNotificationsCollection();
    
    // Authenticate as demo user
    const auth = await authenticateDemoUser();
    
    if (auth && tokensCreated) {
      // Populate tokens
      await populateTokens(auth.userId, auth.token);
    }
    
    console.log('\nPocketBase setup completed!');
    console.log('You can now use the application with the following credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password');
    
    // Provide instructions for manual setup if any collection failed to create
    if (!tokensCreated || !portfolioCreated || !transactionsCreated || !walletsCreated || !notificationsCreated) {
      console.log('\nSome collections could not be created automatically.');
      console.log('Please follow the setup-guide.md to create the remaining collections manually.');
    }
  } catch (error) {
    console.error('Setup failed:', error.message);
  }
}

// Run the main function
main();

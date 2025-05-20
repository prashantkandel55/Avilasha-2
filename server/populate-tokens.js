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
    throw error;
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

// Function to check if tokens collection exists
async function checkTokensCollection() {
  try {
    await axios.get(`${PB_URL}/collections/tokens`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('\nThe tokens collection does not exist yet.');
      console.log('Please create it in the PocketBase Admin UI:');
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
      console.log('   - user_id (Relation, Required, Collection: users)');
      console.log('   - is_favorite (Boolean, Default: false)');
      console.log('7. Run this script again after creating the collection');
    }
    return false;
  }
}

// Function to populate tokens collection
async function populateTokens(userId, token) {
  // Check if tokens collection exists
  const tokensCollectionExists = await checkTokensCollection();
  if (!tokensCollectionExists) {
    return;
  }
  
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
        {
          ...tokenData,
          user_id: userId
        },
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
    console.log('Starting token population...');
    
    // Authenticate as demo user
    const { userId, token } = await authenticateDemoUser();
    
    // Populate tokens
    await populateTokens(userId, token);
    
    console.log('Token population completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();

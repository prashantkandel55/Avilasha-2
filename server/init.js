const fs = require('fs');
const path = require('path');
const axios = require('axios');

// PocketBase API endpoint
const PB_URL = 'http://localhost:8090/api';

// Read schema file
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, 'pb_schema.json'), 'utf8'));

// Function to create a demo user directly through the API
async function createDemoUser() {
  try {
    console.log('Creating demo user...');
    const response = await axios.post(`${PB_URL}/collections/users/records`, {
      email: 'demo@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'Demo User',
      role: 'user',
      verified: true,
    });
    
    console.log('Demo user created successfully');
    return response.data.id;
  } catch (error) {
    if (error.response?.data?.code === 400 && error.response?.data?.message?.includes('email already exists')) {
      console.log('Demo user already exists, fetching ID...');
      try {
        const usersResponse = await axios.get(`${PB_URL}/collections/users/records?filter=(email='demo@example.com')`);
        if (usersResponse.data.items && usersResponse.data.items.length > 0) {
          return usersResponse.data.items[0].id;
        } else {
          console.log('Demo user not found, please create it manually in the admin UI');
          return null;
        }
      } catch (err) {
        console.error('Error fetching demo user:', err.message);
        return null;
      }
    } else {
      console.error('Error creating demo user:', error.message);
      return null;
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
      is_favorite: false,
    }));
  } catch (error) {
    console.error('Error fetching sample tokens:', error.message);
    return [];
  }
}

// Function to populate tokens collection
async function populateTokens(userId) {
  if (!userId) {
    console.log('No user ID provided, skipping token population');
    return;
  }
  
  const tokens = await fetchSampleTokens();
  if (tokens.length === 0) {
    console.log('No tokens fetched, skipping token population');
    return;
  }
  
  console.log(`Adding ${tokens.length} tokens to the database...`);
  let addedCount = 0;
  
  for (const token of tokens) {
    try {
      await axios.post(`${PB_URL}/collections/tokens/records`, {
        ...token,
        user_id: userId,
      });
      addedCount++;
      
      // Log progress every 10 tokens
      if (addedCount % 10 === 0) {
        console.log(`Added ${addedCount}/${tokens.length} tokens...`);
      }
    } catch (error) {
      console.error(`Error adding token ${token.name}:`, error.message);
    }
  }
  
  console.log(`Successfully added ${addedCount} tokens to the database`);
}

// Main function
async function main() {
  try {
    console.log('Starting PocketBase initialization...');
    
    // Create demo user
    console.log('Creating demo user...');
    const userId = await createDemoUser();
    
    if (userId) {
      console.log(`Demo user created with ID: ${userId}`);
      
      // Populate tokens
      await populateTokens(userId);
    } else {
      console.log('Failed to create or find demo user. Please create a user manually in the admin UI.');
    }
    
    console.log('PocketBase initialization completed');
    console.log('Please follow the setup-guide.md to create the necessary collections in the admin UI.');
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

// Run the main function
main();

const axios = require('axios');

// PocketBase API endpoint
const PB_URL = 'http://localhost:8090/api';

// Function to create a demo user
async function createDemoUser() {
  try {
    console.log('Creating demo user...');
    const response = await axios.post(`${PB_URL}/collections/users/records`, {
      email: 'demo@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'Demo User'
    });
    
    console.log('Demo user created successfully with ID:', response.data.id);
    return response.data.id;
  } catch (error) {
    console.error('Error creating demo user:', error.response?.data || error.message);
    
    // If the error is because the collection doesn't exist yet
    if (error.response?.status === 404) {
      console.log('\nThe users collection does not exist yet.');
      console.log('Please create it in the PocketBase Admin UI:');
      console.log('1. Go to http://localhost:8090/_/');
      console.log('2. Click on "Collections" in the sidebar');
      console.log('3. Click "New collection"');
      console.log('4. Name: "users", Type: "Auth collection"');
      console.log('5. Click "Create"');
      console.log('6. Run this script again after creating the collection');
    }
    
    return null;
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
          per_page: 20, // Reduced to 20 for faster processing
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

// Main function
async function main() {
  try {
    console.log('Starting demo user creation...');
    
    // Create demo user
    const userId = await createDemoUser();
    
    if (userId) {
      console.log('Demo user created successfully!');
      console.log('You can now log in with:');
      console.log('Email: demo@example.com');
      console.log('Password: password');
      
      // Fetch sample tokens
      const tokens = await fetchSampleTokens();
      console.log(`Retrieved ${tokens.length} sample tokens`);
      
      // Display some sample token data
      if (tokens.length > 0) {
        console.log('\nSample token data:');
        console.log(tokens[0]);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();

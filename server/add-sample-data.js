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
          per_page: 20,
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
    console.log('Starting sample data generation...');
    
    // Authenticate as demo user
    const auth = await authenticateDemoUser();
    
    if (!auth) {
      console.log('Failed to authenticate. Please make sure the demo user exists.');
      console.log('You can create a demo user by running the create-demo-user.js script.');
      return;
    }
    
    // Fetch sample tokens
    const tokens = await fetchSampleTokens();
    
    if (tokens.length === 0) {
      console.log('Failed to fetch token data from CoinGecko.');
      return;
    }
    
    // Display sample token data
    console.log('\nSample token data that can be used in your application:');
    console.log(JSON.stringify(tokens[0], null, 2));
    
    console.log('\nAll sample tokens:');
    tokens.forEach((token, index) => {
      console.log(`${index + 1}. ${token.name} (${token.symbol.toUpperCase()}) - $${token.current_price}`);
    });
    
    console.log('\nSample data generation completed!');
    console.log('You can use this data in your application by copying it from the console output.');
    console.log('Or you can use the CoinGecko API directly in your application.');
    
    // Save to a JSON file for easy access
    const fs = require('fs');
    fs.writeFileSync('sample-tokens.json', JSON.stringify(tokens, null, 2));
    console.log('\nSample token data has been saved to sample-tokens.json');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();

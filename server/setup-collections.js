const axios = require('axios');

// PocketBase API endpoint
const PB_URL = 'http://localhost:8090/api';

// Admin credentials - replace these with your actual credentials
const ADMIN_EMAIL = 'your-admin-email@example.com';
const ADMIN_PASSWORD = 'your-admin-password';

// Collection definitions
const collections = [
  {
    name: 'users',
    type: 'auth',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true
      },
      {
        name: 'avatar',
        type: 'file',
        required: false
      },
      {
        name: 'role',
        type: 'select',
        required: true,
        options: {
          values: ["user", "admin"]
        },
        default: "user"
      },
      {
        name: 'verified',
        type: 'bool',
        required: false,
        default: false
      }
    ]
  },
  {
    name: 'tokens',
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
        name: 'user_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: false
        }
      },
      {
        name: 'is_favorite',
        type: 'bool',
        required: false,
        default: false
      }
    ]
  },
  {
    name: 'portfolio',
    schema: [
      {
        name: 'token_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'tokens',
          cascadeDelete: true
        }
      },
      {
        name: 'user_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true
        }
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
  },
  {
    name: 'transactions',
    schema: [
      {
        name: 'user_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true
        }
      },
      {
        name: 'token_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'tokens',
          cascadeDelete: false
        }
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
  },
  {
    name: 'wallets',
    schema: [
      {
        name: 'user_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true
        }
      },
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
  },
  {
    name: 'notifications',
    schema: [
      {
        name: 'user_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true
        }
      },
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
  }
];

// Function to authenticate as admin
async function authenticateAdmin() {
  try {
    console.log('Authenticating as admin...');
    const response = await axios.post(`${PB_URL}/admins/auth-with-password`, {
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    console.log('Admin authentication successful');
    return response.data.token;
  } catch (error) {
    console.error('Admin authentication failed:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create collections
async function createCollections(token) {
  for (const collection of collections) {
    try {
      console.log(`Creating collection: ${collection.name}`);
      
      await axios.post(
        `${PB_URL}/collections`,
        collection,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log(`Collection ${collection.name} created successfully`);
    } catch (error) {
      if (error.response?.data?.code === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log(`Collection ${collection.name} already exists, skipping...`);
      } else {
        console.error(`Error creating collection ${collection.name}:`, error.response?.data || error.message);
      }
    }
  }
}

// Function to create a demo user
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
          console.log('Found existing demo user');
          return usersResponse.data.items[0].id;
        } else {
          console.log('Demo user not found');
          return null;
        }
      } catch (err) {
        console.error('Error fetching demo user:', err.message);
        return null;
      }
    } else {
      console.error('Error creating demo user:', error.response?.data || error.message);
      return null;
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Starting PocketBase setup...');
    
    // First, update the admin credentials in this file
    console.log('IMPORTANT: Before running this script, make sure to update the ADMIN_EMAIL and ADMIN_PASSWORD variables with your actual admin credentials.');
    
    // Check if admin credentials have been updated
    if (ADMIN_EMAIL === 'your-admin-email@example.com' || ADMIN_PASSWORD === 'your-admin-password') {
      console.error('ERROR: Please update the admin credentials in the script before running it.');
      console.log('1. Open setup-collections.js in a text editor');
      console.log('2. Find the ADMIN_EMAIL and ADMIN_PASSWORD variables at the top');
      console.log('3. Replace them with the email and password you used to create your admin account');
      console.log('4. Save the file and run the script again');
      return;
    }
    
    // Authenticate as admin
    const token = await authenticateAdmin();
    
    // Create collections
    await createCollections(token);
    
    // Create demo user
    const userId = await createDemoUser();
    
    if (userId) {
      console.log(`Demo user created with ID: ${userId}`);
    } else {
      console.log('Failed to create demo user');
    }
    
    console.log('PocketBase setup completed successfully');
    console.log('You can now run the init.js script to populate the database with sample data');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Run the main function
main();

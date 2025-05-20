import PocketBase, { RecordAuthResponse, RecordModel } from 'pocketbase';

// Get environment variables
const pocketbaseUrl = (import.meta.env as any).VITE_POCKETBASE_URL || 'http://localhost:8090';

// Initialize PocketBase
const pb = new PocketBase(pocketbaseUrl);

// Test function to verify connection
export const testPocketBaseConnection = async () => {
  try {
    const isValid = pb.authStore.isValid;
    console.log('PocketBase connection initialized, auth state:', isValid ? 'authenticated' : 'not authenticated');
    return { success: true, isAuthenticated: isValid };
  } catch (err) {
    console.error('Unexpected error connecting to PocketBase:', err);
    return { success: false, error: err };
  }
};

// Custom User type to replace Supabase User
export interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    avatar?: string;
    role?: string;
  };
  app_metadata: Record<string, any>;
  aud: string;
  created_at: string;
  updated_at: string;
  role?: string;
}

// Types
export interface PocketBaseUser extends RecordModel {
  email: string;
  name: string;
  avatar?: string;
  verified: boolean;
  role: 'user' | 'admin';
}

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  user_id: string;
  is_favorite: boolean;
}

export interface PortfolioItem {
  id: string;
  token_id: string;
  user_id: string;
  amount: number;
  purchase_price: number;
  purchase_date: string;
}

// Auth functions
export const authService = {
  /**
   * Register a new user
   */
  register: async (email: string, password: string, name: string): Promise<User> => {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
      };
      
      const record = await pb.collection('users').create(data);
      
      // Auto login after registration
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      // Convert to Supabase User format for compatibility with existing code
      return convertPocketBaseUser(authData as unknown as RecordAuthResponse<PocketBaseUser>);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return convertPocketBaseUser(authData as unknown as RecordAuthResponse<PocketBaseUser>);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    pb.authStore.clear();
  },
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser: (): User | null => {
    if (pb.authStore.isValid && pb.authStore.model) {
      return convertPocketBaseUser({
        record: pb.authStore.model as unknown as PocketBaseUser,
        token: pb.authStore.token
      } as RecordAuthResponse<PocketBaseUser>);
    }
    return null;
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return pb.authStore.isValid;
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (userId: string, data: Partial<PocketBaseUser>): Promise<User> => {
    try {
      const record = await pb.collection('users').update(userId, data);
      return convertPocketBaseUser({
        record,
        token: pb.authStore.token
      } as RecordAuthResponse<PocketBaseUser>);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Send password reset email
   */
  sendPasswordResetEmail: async (email: string): Promise<void> => {
    try {
      await pb.collection('users').requestPasswordReset(email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Upload avatar image
   */
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const record = await pb.collection('users').update(userId, formData);
      
      // Return the avatar URL
      return pb.getFileUrl(record, record.avatar);
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      throw new Error(error.message);
    }
  }
};

// Token functions
export const tokenService = {
  /**
   * Get all tokens
   */
  getTokens: async (): Promise<TokenData[]> => {
    try {
      const records = await pb.collection('tokens').getFullList();
      return records as unknown as TokenData[];
    } catch (error: any) {
      console.error('Get tokens error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Get token by ID
   */
  getTokenById: async (id: string): Promise<TokenData> => {
    try {
      const record = await pb.collection('tokens').getOne(id);
      return record as unknown as TokenData;
    } catch (error: any) {
      console.error('Get token error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Toggle favorite token
   */
  toggleFavorite: async (tokenId: string, isFavorite: boolean): Promise<void> => {
    try {
      await pb.collection('tokens').update(tokenId, {
        is_favorite: isFavorite
      });
    } catch (error: any) {
      console.error('Toggle favorite error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Get favorite tokens
   */
  getFavorites: async (userId: string): Promise<TokenData[]> => {
    try {
      const records = await pb.collection('tokens').getFullList({
        filter: `user_id="${userId}" && is_favorite=true`
      });
      return records as unknown as TokenData[];
    } catch (error: any) {
      console.error('Get favorites error:', error);
      throw new Error(error.message);
    }
  }
};

// Portfolio functions
export const portfolioService = {
  /**
   * Get user portfolio
   */
  getPortfolio: async (userId: string): Promise<PortfolioItem[]> => {
    try {
      const records = await pb.collection('portfolio').getFullList({
        filter: `user_id="${userId}"`,
        expand: 'token_id'
      });
      return records as unknown as PortfolioItem[];
    } catch (error: any) {
      console.error('Get portfolio error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Add token to portfolio
   */
  addToPortfolio: async (data: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> => {
    try {
      const record = await pb.collection('portfolio').create(data);
      return record as unknown as PortfolioItem;
    } catch (error: any) {
      console.error('Add to portfolio error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Update portfolio item
   */
  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
    try {
      const record = await pb.collection('portfolio').update(id, data);
      return record as unknown as PortfolioItem;
    } catch (error: any) {
      console.error('Update portfolio item error:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Remove from portfolio
   */
  removeFromPortfolio: async (id: string): Promise<void> => {
    try {
      await pb.collection('portfolio').delete(id);
    } catch (error: any) {
      console.error('Remove from portfolio error:', error);
      throw new Error(error.message);
    }
  }
};

// Real-time subscriptions
export const subscribeToTokenUpdates = (callback: (token: TokenData) => void) => {
  return pb.collection('tokens').subscribe('*', (e) => {
    callback(e.record as unknown as TokenData);
  });
};

export const subscribeToPortfolioUpdates = (userId: string, callback: (portfolio: PortfolioItem) => void) => {
  return pb.collection('portfolio').subscribe('*', (e) => {
    if (e.record.user_id === userId) {
      callback(e.record as unknown as PortfolioItem);
    }
  });
};

// Helper function to convert PocketBase user to our custom User format
function convertPocketBaseUser(authData: RecordAuthResponse<PocketBaseUser>): User {
  const { record } = authData;
  
  return {
    id: record.id,
    email: record.email,
    user_metadata: {
      name: record.name,
      avatar: record.avatar ? pb.getFileUrl(record, record.avatar) : undefined,
      role: record.role
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: record.created,
    role: record.role,
    updated_at: record.updated
  };
}

export default pb;

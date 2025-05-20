/**
 * Service for interacting with Electron's secure storage
 * Provides fallback to localStorage when running in a browser environment
 */

// Add type declaration for window.electron
declare global {
  interface Window {
    electron?: {
      secureStore: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<boolean>;
        remove: (key: string) => Promise<boolean>;
        clear: () => Promise<boolean>;
        has: (key: string) => Promise<boolean>;
      };
    };
  }
}

/**
 * Check if we're running in Electron
 * This is a safe check that works in both Electron and browser environments
 */
const isElectron = (): boolean => {
  try {
    return window && window.electron !== undefined;
  } catch (e) {
    return false;
  }
};

/**
 * Secure storage service for storing sensitive data
 * Uses Electron's secure storage when available, falls back to localStorage
 */
export const secureStorageService = {
  /**
   * Store a value in secure storage
   * @param key The key to store the value under
   * @param value The value to store
   * @returns A promise that resolves to true if successful
   */
  async set(key: string, value: any): Promise<boolean> {
    if (!isElectron()) {
      console.warn('Using localStorage in browser environment');
      try {
        localStorage.setItem(`avilasha_${key}`, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error storing data in localStorage:', error);
        return false;
      }
    }
    
    try {
      // @ts-ignore - Electron API is available but TypeScript doesn't know about it
      return await window.electron.secureStore.set(key, value);
    } catch (error) {
      console.error('Error storing data in secure storage:', error);
      return false;
    }
  },
  
  /**
   * Get a value from secure storage
   * @param key The key to retrieve
   * @returns A promise that resolves to the stored value, or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    if (!isElectron()) {
      console.warn('Using localStorage in browser environment');
      try {
        const value = localStorage.getItem(`avilasha_${key}`);
        return value !== null ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Error retrieving data from localStorage:', error);
        return null;
      }
    }
    
    try {
      // @ts-ignore - Electron API is available but TypeScript doesn't know about it
      const value = await window.electron.secureStore.get(key);
      return value !== undefined ? value : null;
    } catch (error) {
      console.error('Error retrieving data from secure storage:', error);
      return null;
    }
  },
  
  /**
   * Remove a value from secure storage
   * @param key The key to remove
   * @returns A promise that resolves to true if successful
   */
  async remove(key: string): Promise<boolean> {
    if (!isElectron()) {
      console.warn('Using localStorage in browser environment');
      try {
        localStorage.removeItem(`avilasha_${key}`);
        return true;
      } catch (error) {
        console.error('Error removing data from localStorage:', error);
        return false;
      }
    }
    
    try {
      // @ts-ignore - Electron API is available but TypeScript doesn't know about it
      return await window.electron.secureStore.remove(key);
    } catch (error) {
      console.error('Error removing data from secure storage:', error);
      return false;
    }
  },
  
  /**
   * Clear all values from secure storage
   * @returns A promise that resolves to true if successful
   */
  async clear(): Promise<boolean> {
    if (!isElectron()) {
      console.warn('Using localStorage in browser environment');
      try {
        // Only clear keys that start with our prefix
        Object.keys(localStorage)
          .filter(key => key.startsWith('avilasha_'))
          .forEach(key => localStorage.removeItem(key));
        return true;
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
      }
    }
    
    try {
      // @ts-ignore - Electron API is available but TypeScript doesn't know about it
      return await window.electron.secureStore.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      return false;
    }
  },
  
  /**
   * Check if a key exists in secure storage
   * @param key The key to check
   * @returns A promise that resolves to true if the key exists
   */
  async has(key: string): Promise<boolean> {
    if (!isElectron()) {
      console.warn('Using localStorage in browser environment');
      try {
        return localStorage.getItem(`avilasha_${key}`) !== null;
      } catch (error) {
        console.error('Error checking key in localStorage:', error);
        return false;
      }
    }
    
    try {
      // @ts-ignore - Electron API is available but TypeScript doesn't know about it
      return await window.electron.secureStore.has(key);
    } catch (error) {
      console.error('Error checking key in secure storage:', error);
      return false;
    }
  }
};

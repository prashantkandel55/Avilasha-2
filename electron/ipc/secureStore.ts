import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { app } from 'electron';

// Define the secure store interface
interface SecureStoreData {
  [key: string]: any;
}

// Define encryption settings
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 16 bytes
const AUTH_TAG_LENGTH = 16; // 16 bytes

// Generate a unique encryption key based on the machine
let encryptionKey: Buffer;

// Path to store the encrypted data
const storePath = path.join(app.getPath('userData'), 'secure-store.dat');
const keyPath = path.join(app.getPath('userData'), '.key');

/**
 * Initialize the secure store by generating or loading the encryption key
 */
function initializeSecureStore() {
  try {
    // Check if the key file exists
    if (fs.existsSync(keyPath)) {
      // Load the existing key
      encryptionKey = Buffer.from(fs.readFileSync(keyPath, 'utf8'), 'hex');
    } else {
      // Generate a new key
      encryptionKey = crypto.randomBytes(ENCRYPTION_KEY_LENGTH);
      // Save the key
      fs.writeFileSync(keyPath, encryptionKey.toString('hex'), { mode: 0o600 });
    }
    
    console.log('Secure store initialized successfully');
  } catch (error) {
    console.error('Error initializing secure store:', error);
    // Generate a temporary key if we can't read/write the key file
    encryptionKey = crypto.pbkdf2Sync(
      app.getPath('userData'), // Use app data path as a seed
      'avilasha-salt', // Salt
      10000, // Iterations
      ENCRYPTION_KEY_LENGTH,
      'sha256'
    );
  }
}

/**
 * Encrypt data using AES-256-GCM
 * @param data Data to encrypt
 * @returns Encrypted data as a string
 */
function encryptData(data: any): string {
  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
    
    // Encrypt the data
    const jsonData = JSON.stringify(data);
    const encryptedData = Buffer.concat([
      cipher.update(jsonData, 'utf8'),
      cipher.final()
    ]);
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag();
    
    // Combine IV, encrypted data, and auth tag
    const result = Buffer.concat([
      iv,
      encryptedData,
      authTag
    ]);
    
    return result.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData Encrypted data as a string
 * @returns Decrypted data
 */
function decryptData(encryptedData: string): any {
  try {
    // Convert the encrypted data from base64 to buffer
    const data = Buffer.from(encryptedData, 'base64');
    
    // Extract IV, encrypted data, and auth tag
    const iv = data.slice(0, IV_LENGTH);
    const authTag = data.slice(data.length - AUTH_TAG_LENGTH);
    const encryptedContent = data.slice(IV_LENGTH, data.length - AUTH_TAG_LENGTH);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    const decrypted = Buffer.concat([
      decipher.update(encryptedContent),
      decipher.final()
    ]);
    
    // Parse the JSON data
    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Load the secure store data from disk
 * @returns The secure store data
 */
function loadSecureStore(): SecureStoreData {
  try {
    if (fs.existsSync(storePath)) {
      const encryptedData = fs.readFileSync(storePath, 'utf8');
      return decryptData(encryptedData);
    }
    return {};
  } catch (error) {
    console.error('Error loading secure store:', error);
    return {};
  }
}

/**
 * Save the secure store data to disk
 * @param data The secure store data
 */
function saveSecureStore(data: SecureStoreData): void {
  try {
    const encryptedData = encryptData(data);
    fs.writeFileSync(storePath, encryptedData, { mode: 0o600 });
  } catch (error) {
    console.error('Error saving secure store:', error);
    throw new Error('Failed to save secure store');
  }
}

/**
 * Set up the secure store IPC handlers
 */
export function setupSecureStore(): void {
  // Initialize the secure store
  initializeSecureStore();
  
  // Load the secure store data
  let secureStoreData = loadSecureStore();
  
  // Handle getting a value from the secure store
  ipcMain.handle('secureStore:get', (_, key: string) => {
    return secureStoreData[key];
  });
  
  // Handle setting a value in the secure store
  ipcMain.handle('secureStore:set', (_, key: string, value: any) => {
    secureStoreData[key] = value;
    saveSecureStore(secureStoreData);
    return true;
  });
  
  // Handle removing a value from the secure store
  ipcMain.handle('secureStore:remove', (_, key: string) => {
    if (key in secureStoreData) {
      delete secureStoreData[key];
      saveSecureStore(secureStoreData);
      return true;
    }
    return false;
  });
  
  // Handle clearing the secure store
  ipcMain.handle('secureStore:clear', () => {
    secureStoreData = {};
    saveSecureStore(secureStoreData);
    return true;
  });
  
  // Handle checking if a key exists in the secure store
  ipcMain.handle('secureStore:has', (_, key: string) => {
    return key in secureStoreData;
  });
  
  console.log('Secure store IPC handlers set up');
}

import { contextBridge, ipcRenderer } from 'electron';

// Define the types for the secure store API
interface SecureStoreAPI {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<boolean>;
  remove: (key: string) => Promise<boolean>;
  clear: () => Promise<boolean>;
  has: (key: string) => Promise<boolean>;
}

// Define the types for the electron API
interface ElectronAPI {
  versions: {
    node: () => string;
    chrome: () => string;
    electron: () => string;
  };
  secureStore: SecureStoreAPI;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Provide version information
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  
  // Expose secure store methods
  secureStore: {
    get: (key: string) => ipcRenderer.invoke('secureStore:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('secureStore:set', key, value),
    remove: (key: string) => ipcRenderer.invoke('secureStore:remove', key),
    clear: () => ipcRenderer.invoke('secureStore:clear'),
    has: (key: string) => ipcRenderer.invoke('secureStore:has', key),
  },
} as ElectronAPI);

// Log when the preload script has been executed
console.log('Preload script has been loaded');


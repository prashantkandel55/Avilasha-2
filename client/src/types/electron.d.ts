/**
 * Type definitions for Electron's exposed APIs
 */

interface SecureStoreAPI {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<boolean>;
  remove: (key: string) => Promise<boolean>;
  clear: () => Promise<boolean>;
  has: (key: string) => Promise<boolean>;
}

interface ElectronAPI {
  versions: {
    node: () => string;
    chrome: () => string;
    electron: () => string;
  };
  secureStore: SecureStoreAPI;
}

interface Window {
  electron: ElectronAPI;
}

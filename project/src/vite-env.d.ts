/// <reference types="vite/client" />

interface Window {
  chrome?: {
    storage?: {
      sync: {
        get: (key: string) => Promise<any>;
        set: (items: object) => Promise<void>;
      };
    };
  };
}

interface Browser {
  storage?: {
    sync: {
      get: (key: string) => Promise<any>;
      set: (items: object) => Promise<void>;
    };
  };
}

declare const browser: Browser | undefined;
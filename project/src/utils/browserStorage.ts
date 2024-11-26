interface StorageData {
  bookmarks?: string;
  playlist?: string;
}

class BrowserStorage {
  private static instance: BrowserStorage;
  private browserType: 'chrome' | 'firefox' | 'safari' | 'other';

  private constructor() {
    this.browserType = this.detectBrowser();
  }

  static getInstance(): BrowserStorage {
    if (!BrowserStorage.instance) {
      BrowserStorage.instance = new BrowserStorage();
    }
    return BrowserStorage.instance;
  }

  private detectBrowser(): 'chrome' | 'firefox' | 'safari' | 'other' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('safari')) return 'safari';
    return 'other';
  }

  async set(key: keyof StorageData, value: string): Promise<void> {
    try {
      if (this.browserType === 'chrome' && chrome?.storage?.sync) {
        await chrome.storage.sync.set({ [key]: value });
      } else if (this.browserType === 'firefox' && browser?.storage?.sync) {
        await browser.storage.sync.set({ [key]: value });
      } else {
        localStorage.setItem(key, value);
        // Also update URL for non-extension environments
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(key, value);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
      }
    } catch (error) {
      console.error('Storage error:', error);
      // Fallback to URL params
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set(key, value);
      window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
    }
  }

  async get(key: keyof StorageData): Promise<string | null> {
    try {
      if (this.browserType === 'chrome' && chrome?.storage?.sync) {
        const result = await chrome.storage.sync.get(key);
        return result[key] || null;
      } else if (this.browserType === 'firefox' && browser?.storage?.sync) {
        const result = await browser.storage.sync.get(key);
        return result[key] || null;
      } else {
        // Try localStorage first
        const stored = localStorage.getItem(key);
        if (stored) return stored;
        
        // Fallback to URL params
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(key);
      }
    } catch (error) {
      console.error('Storage error:', error);
      // Fallback to URL params
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(key);
    }
  }
}

export const browserStorage = BrowserStorage.getInstance();
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
      }
    } catch (error) {
      console.error('Storage error:', error);
      // Fallback to localStorage
      localStorage.setItem(key, value);
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
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.error('Storage error:', error);
      return localStorage.getItem(key);
    }
  }
}

export const browserStorage = BrowserStorage.getInstance();
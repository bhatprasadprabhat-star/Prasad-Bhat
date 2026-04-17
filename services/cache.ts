
/**
 * Simple caching service using localStorage to enable offline access
 * for AI-generated readings and astrological data.
 */

interface CachedItem<T> {
  data: T;
  timestamp: number;
  expiry?: number; // expiry in milliseconds
}

class AstroCache {
  private prefix = 'astro_cache_';

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttlHours: number = 24 * 7): void {
    try {
      const item: CachedItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: ttlHours > 0 ? Date.now() + ttlHours * 60 * 60 * 1000 : undefined
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (e) {
      console.warn('Failed to cache data:', e);
      // If quota exceeded, clear old cache items
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        this.clearOldItems();
      }
    }
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;

      const item: CachedItem<T> = JSON.parse(raw);
      
      // Check if expired
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return item.data;
    } catch (e) {
      console.error('Error reading from cache:', e);
      return null;
    }
  }

  /**
   * Clear old or expired items to manage storage
   */
  clearOldItems(): void {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const item = JSON.parse(raw);
            if (item.expiry && now > item.expiry) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });

    // If still tight, remove items older than 30 days regardless of expiry
    if (keys.length > 50) {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const item = JSON.parse(raw);
              if (now - item.timestamp > thirtyDays) {
                localStorage.removeItem(key);
              }
            }
          } catch (e) {}
        }
      });
    }
  }

  /**
   * Manual remove
   */
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }
}

export const astroCache = new AstroCache();

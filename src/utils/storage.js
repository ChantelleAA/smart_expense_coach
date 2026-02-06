// storage.js - Handle local storage operations with IndexedDB fallback

const STORAGE_KEY = 'smart-expense-coach';
const DB_NAME = 'ExpenseCoachDB';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

class StorageManager {
  constructor() {
    this.db = null;
    this.initDB();
  }

  // Initialize IndexedDB
  async initDB() {
    if (!window.indexedDB) {
      console.warn('IndexedDB not available, falling back to localStorage');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store for transactions
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  // Save transactions
  async saveTransactions(transactions) {
    try {
      if (this.db) {
        return await this._saveToIndexedDB(transactions);
      } else {
        return this._saveToLocalStorage(transactions);
      }
    } catch (error) {
      console.error('Error saving transactions:', error);
      // Fallback to localStorage
      return this._saveToLocalStorage(transactions);
    }
  }

  // Load transactions
  async loadTransactions() {
    try {
      if (this.db) {
        return await this._loadFromIndexedDB();
      } else {
        return this._loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      return this._loadFromLocalStorage();
    }
  }

  // Clear all data
  async clearAll() {
    try {
      if (this.db) {
        await this._clearIndexedDB();
      }
      this._clearLocalStorage();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // IndexedDB operations
  async _saveToIndexedDB(transactions) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Clear existing data
      store.clear();
      
      // Add all transactions
      transactions.forEach(tx => {
        store.add(tx);
      });

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async _loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async _clearIndexedDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // LocalStorage operations (fallback)
  _saveToLocalStorage(transactions) {
    try {
      const data = {
        transactions,
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: '1.0'
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('LocalStorage save error:', error);
      return false;
    }
  }

  _loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.transactions || [];
    } catch (error) {
      console.error('LocalStorage load error:', error);
      return [];
    }
  }

  _clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Save user preferences
  savePreferences(preferences) {
    try {
      localStorage.setItem(`${STORAGE_KEY}-preferences`, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }

  // Load user preferences
  loadPreferences() {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}-preferences`);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading preferences:', error);
      return {};
    }
  }

  // Save category overrides
  saveCategoryOverrides(overrides) {
    try {
      localStorage.setItem(`${STORAGE_KEY}-category-overrides`, JSON.stringify(overrides));
      return true;
    } catch (error) {
      console.error('Error saving category overrides:', error);
      return false;
    }
  }

  // Load category overrides
  loadCategoryOverrides() {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}-category-overrides`);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading category overrides:', error);
      return {};
    }
  }
}

export default new StorageManager();

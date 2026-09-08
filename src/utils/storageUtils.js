import { DATABASE_NAME, STORE_PERSIST_KEY } from '../services/database.js';

/**
 * Storage utilities for calculating IndexedDB usage
 */

export const getStorageEstimate = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      usageInMB: ((estimate.usage || 0) / (1024 * 1024)).toFixed(2),
      quotaInMB: ((estimate.quota || 0) / (1024 * 1024)).toFixed(2),
      percentUsed: estimate.quota ? ((estimate.usage / estimate.quota) * 100).toFixed(1) : 0,
    };
  }
  return null;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0 || !bytes || isNaN(bytes) || bytes < 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const clearAllStorage = async () => {
  try {
    // Clear app-local localStorage key only
    localStorage.removeItem(STORE_PERSIST_KEY);
    
    // Clear app IndexedDB only
    if ('indexedDB' in window) {
      await new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DATABASE_NAME);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

export const exportAllData = async () => {
  try {
    const persistedRaw = localStorage.getItem(STORE_PERSIST_KEY);
    let persistedState = null;
    if (persistedRaw) {
      try {
        persistedState = JSON.parse(persistedRaw);
      } catch {
        persistedState = persistedRaw;
      }
    }

    const data = {
      version: '1.5.0',
      exportDate: new Date().toISOString(),
      localStorage: {
        [STORE_PERSIST_KEY]: persistedState,
      },
      indexedDB: {
        database: DATABASE_NAME,
      },
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `video-annotation-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

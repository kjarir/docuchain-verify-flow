
/**
 * API Key Service
 * This simulates a backend service for API key management
 */

import { generateHash } from './blockchainUtils';

// In a real application, this would be stored in a database
const API_KEYS_STORAGE_KEY = 'docuchain_api_keys';

export interface ApiKey {
  key: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

// Initialize API keys in localStorage if not exists
const initializeApiKeys = (): void => {
  if (!localStorage.getItem(API_KEYS_STORAGE_KEY)) {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all API keys
export const getAllApiKeys = (): ApiKey[] => {
  initializeApiKeys();
  const keys = localStorage.getItem(API_KEYS_STORAGE_KEY);
  return keys ? JSON.parse(keys) : [];
};

// Generate a new API key
export const generateApiKey = (name: string): ApiKey => {
  const newKey: ApiKey = {
    key: `dk_${generateHash(32)}`,
    name,
    createdAt: new Date().toISOString(),
    usageCount: 0
  };
  
  const keys = getAllApiKeys();
  keys.push(newKey);
  localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
  
  return newKey;
};

// Validate an API key
export const validateApiKey = (key: string): boolean => {
  const keys = getAllApiKeys();
  const apiKey = keys.find(k => k.key === key);
  
  if (apiKey) {
    // Update last used and usage count
    apiKey.lastUsed = new Date().toISOString();
    apiKey.usageCount += 1;
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
    return true;
  }
  
  return false;
};

// Delete an API key
export const deleteApiKey = (key: string): boolean => {
  const keys = getAllApiKeys();
  const updatedKeys = keys.filter(k => k.key !== key);
  
  if (keys.length !== updatedKeys.length) {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(updatedKeys));
    return true;
  }
  
  return false;
};

// Get an API key's details
export const getApiKeyDetails = (key: string): ApiKey | null => {
  const keys = getAllApiKeys();
  return keys.find(k => k.key === key) || null;
};

// Create a default API key if none exists
export const ensureDefaultApiKey = (): ApiKey => {
  const keys = getAllApiKeys();
  if (keys.length === 0) {
    return generateApiKey("Default API Key");
  }
  return keys[0];
};

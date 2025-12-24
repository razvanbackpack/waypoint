import { useState, useEffect, useCallback } from 'react';
import { setApiKey as setClientApiKey } from '../client';
import { loadConfig, updateConfig } from '../../utils/config';

// API key format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
const API_KEY_REGEX = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{20}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i;

// Default API key for development
const DEFAULT_API_KEY = 'E4DA7782-E8C6-9E45-80A9-F42BB73CFFC037EC53DB-BB66-4982-AE88-182652A6F7EB';

export interface UseApiKeyReturn {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isValidKey: (key: string) => boolean;
  hasApiKey: boolean;
  error: string | null;
}

export function useApiKey(): UseApiKeyReturn {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load API key from localStorage or use default
  useEffect(() => {
    const config = loadConfig();
    const key = config.apiKey || DEFAULT_API_KEY;
    setApiKeyState(key);
    setClientApiKey(key);
  }, []);

  const isValidKey = useCallback((key: string): boolean => {
    return API_KEY_REGEX.test(key.trim());
  }, []);

  const setApiKey = useCallback((key: string) => {
    const trimmedKey = key.trim();

    if (!trimmedKey) {
      setError('API key cannot be empty');
      return;
    }

    if (!isValidKey(trimmedKey)) {
      setError('Invalid API key format. Expected format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX');
      return;
    }

    const success = updateConfig({ apiKey: trimmedKey });

    if (success) {
      setApiKeyState(trimmedKey);
      setClientApiKey(trimmedKey);
      setError(null);
    } else {
      setError('Failed to save API key');
    }
  }, [isValidKey]);

  const clearApiKey = useCallback(() => {
    const success = updateConfig({ apiKey: null });

    if (success) {
      setApiKeyState(null);
      setClientApiKey(undefined);
      setError(null);
    } else {
      setError('Failed to clear API key');
    }
  }, []);

  return {
    apiKey,
    setApiKey,
    clearApiKey,
    isValidKey,
    hasApiKey: !!apiKey,
    error,
  };
}

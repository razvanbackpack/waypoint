const STORAGE_KEY = 'gw2-companion-settings';

export interface AppConfig {
  apiKey: string | null;
  theme: 'dark' | 'light' | 'system';
  defaultCharacter?: string | null;
}

function getDefaultConfig(): AppConfig {
  return {
    apiKey: null,
    theme: 'dark',
    defaultCharacter: null,
  };
}

export function loadConfig(): Partial<AppConfig> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load config from localStorage:', err);
  }
  return getDefaultConfig();
}

export function updateConfig(updates: Partial<AppConfig>): boolean {
  try {
    const currentConfig = loadConfig();
    const newConfig = { ...currentConfig, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    return true;
  } catch (err) {
    console.error('Failed to update config:', err);
    return false;
  }
}

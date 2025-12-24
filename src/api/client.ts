import type { ApiError, ApiClientConfig, Language } from './types';

const BASE_URL = 'https://api.guildwars2.com/v2';

export class GW2ApiError extends Error {
  code?: number;
  response?: Response;

  constructor(
    message: string,
    code?: number,
    response?: Response
  ) {
    super(message);
    this.name = 'GW2ApiError';
    this.code = code;
    this.response = response;
  }
}

export class GW2ApiClient {
  private baseUrl: string;
  private apiKey?: string;
  private language: Language;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || BASE_URL;
    this.apiKey = config.apiKey;
    this.language = config.language || 'en';
  }

  setApiKey(apiKey: string | undefined) {
    this.apiKey = apiKey;
  }

  setLanguage(language: Language) {
    this.language = language;
  }

  private buildUrl(endpoint: string, params: Record<string, string | number | string[] | number[] | undefined> = {}): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add language parameter
    url.searchParams.append('lang', this.language);

    // Add API key if available (for authenticated requests)
    if (this.apiKey) {
      url.searchParams.append('access_token', this.apiKey);
    }

    // Add custom parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          // For arrays, use comma-separated values or 'all'
          if (value.length > 0) {
            url.searchParams.append(key, value.join(','));
          }
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      let errorCode = response.status;

      try {
        const errorData = await response.json() as ApiError;
        if (errorData.text) {
          errorMessage = errorData.text;
          errorCode = errorData.code || response.status;
        }
      } catch {
        // If parsing error response fails, use default message
      }

      throw new GW2ApiError(errorMessage, errorCode, response);
    }

    try {
      return await response.json() as T;
    } catch (error) {
      throw new GW2ApiError(
        'Failed to parse API response',
        response.status,
        response
      );
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | string[] | number[] | undefined>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof GW2ApiError) {
        throw error;
      }
      throw new GW2ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getWithIds<T>(
    endpoint: string,
    ids: number[] | string[] | 'all',
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    if (ids === 'all') {
      return this.get<T>(endpoint, { ...params, ids: 'all' });
    }

    if (ids.length === 0) {
      return [] as T;
    }

    // GW2 API supports up to 200 IDs per request
    const chunkSize = 200;
    const chunks: Array<typeof ids> = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
      chunks.push(ids.slice(i, i + chunkSize));
    }

    if (chunks.length === 1) {
      return this.get<T>(endpoint, { ...params, ids: chunks[0] });
    }

    // For multiple chunks, fetch in parallel and combine results
    const results = await Promise.all(
      chunks.map(chunk => this.get<T>(endpoint, { ...params, ids: chunk }))
    );

    // Combine array results
    return results.flat() as T;
  }

  requiresAuth(endpoint: string): boolean {
    const authEndpoints = [
      '/account',
      '/characters',
      '/bank',
      '/materials',
      '/wallet',
      '/achievements',
      '/commerce/transactions',
      '/pvp/games',
      '/pvp/stats',
      '/guild',
      '/home',
      '/mailcarriers',
      '/masteries',
      '/mounts',
      '/outfits',
      '/recipes',
      '/skins',
      '/titles',
      '/worldbosses',
    ];

    return authEndpoints.some(prefix => endpoint.startsWith(prefix));
  }

  isAuthenticated(): boolean {
    return !!this.apiKey;
  }
}

// Singleton instance
let clientInstance: GW2ApiClient | null = null;

export function getApiClient(): GW2ApiClient {
  if (!clientInstance) {
    clientInstance = new GW2ApiClient();
  }
  return clientInstance;
}

export function setApiKey(apiKey: string | undefined) {
  getApiClient().setApiKey(apiKey);
}

export function setLanguage(language: Language) {
  getApiClient().setLanguage(language);
}

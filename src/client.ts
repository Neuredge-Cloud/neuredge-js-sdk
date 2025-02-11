import { ClientConfig, NeuredgeError, ApiResponse, BaseClient } from './types';

export class NeuredgeClient implements BaseClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    // Ensure we handle double slashes
    let baseUrl = config.baseUrl ?? 'https://api.neuredge.dev';
    baseUrl = baseUrl.replace(/\/+$/, '');
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request to the Neuredge API
   */
  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let error: ApiResponse<never>;
        try {
          error = await response.json();
        } catch {
          throw new NeuredgeError(
            'API request failed',
            'REQUEST_FAILED',
            response.status
          );
        }

        throw new NeuredgeError(
          error.error?.message ?? 'Unknown error',
          error.error?.code ?? 'UNKNOWN_ERROR',
          response.status,
          error.error?.details
        );
      }

      // For image generation, return blob
      if (response.headers.get('content-type')?.includes('image/')) {
        return response.blob() as Promise<T>;
      }

      const data = await response.json();
      // Return the data directly if it doesn't follow ApiResponse format
      if (!('success' in data)) {
        return data as T;
      }

      const apiResponse = data as ApiResponse<T>;
      if (!apiResponse.success) {
        throw new NeuredgeError(
          apiResponse.error?.message ?? 'Unknown error',
          apiResponse.error?.code ?? 'UNKNOWN_ERROR',
          undefined,
          apiResponse.error?.details
        );
      }

      return apiResponse.data as T;
    } catch (error) {
      if (error instanceof NeuredgeError) {
        throw error;
      }

      throw new NeuredgeError(
        error instanceof Error ? error.message : 'Network request failed',
        'NETWORK_ERROR'
      );
    }
  }

  /**
   * Helper method for POST requests
   */
  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * Helper method for GET requests
   */
  get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint);
  }

  /**
   * Helper method for DELETE requests
   */
  delete<T>(endpoint: string, body?: unknown): Promise<T> {
    const options: RequestInit = {
      method: 'DELETE',
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    return this.makeRequest<T>(endpoint, options);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

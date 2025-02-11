/**
 * API Configuration options
 */
export interface ClientConfig {
  /**
   * API key for authentication
   */
  apiKey: string;

  /**
   * Base URL for the API (optional)
   * @default "https://api.neuredge.dev"
   */
  baseUrl?: string;
}
/**
 * Error thrown by the Neuredge SDK
 */
export class NeuredgeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'NeuredgeError';
  }
}

/**
 * Common response format for all API endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiMetadata {
  compression_ratio: number;
  original_length: number;
  summary_length: number;
}

export interface ApiUsage {
  input: number;
  output: number;
  total: number;
}

export interface ApiQuota {
  limit: number;
  used: number;
  remaining: number;
  current_request: number;
}

export interface ApiResponse<T> {
  result: T;
  usage: ApiUsage;
  quota: ApiQuota;
}

export interface SummaryResult {
  summary: string;
  metadata: ApiMetadata;
}

export interface TranslationResult {
  translation: string;
  metadata: Record<string, unknown>;
}

/**
 * Vector Store Index Configuration
 */
export interface VectorIndex {
  /**
   * Name of the index
   */
  name: string;

  /**
   * Dimension of vectors to be stored
   */
  dimension: number;

  /**
   * Distance metric for similarity search
   */
  metric: 'cosine' | 'euclidean' | 'dot';

  /**
   * Number of vectors stored in the index
   */
  vector_count?: number;
}

/**
 * Vector with ID for storage
 */
export interface Vector {
  /**
   * Unique identifier for the vector
   */
  id: string | number;

  /**
   * Vector values/embeddings
   */
  values: number[];
}

/**
 * Search result for vector similarity search
 */
export interface SearchVectorResult {
  /**
   * ID of the matched vector
   */
  id: string | number;

  /**
   * Similarity score with query vector
   */
  score: number;
}

export interface VectorIndexResponse {
  id: number;
  user_id: number;
  name: string;
  dimension: number;
  vector_count: number;
  created_at: string;
  deleted: number;
  deleted_at: string | null;
}

export interface ListVectorIndexesResult {
  indexes: VectorIndexResponse[];
}

export interface AddVectorsResult {
  inserted: number;
  ids: string[];
}

export interface SearchVectorMatch {
  id: string | number;
  score: number;
  vector?: number[];
}

export interface SearchVectorResult {
  results: SearchVectorMatch[];
}

/**
 * Options for vector operations
 */
export interface VectorOptions {
  /**
   * Number of results to return for search operations
   * @default 10
   */
  topK?: number;

  /**
   * Optional consistency mode for handling Cloudflare Vectorize latency
   */
  consistency?: {
    /**
     * Enable consistency mode with retries and validation
     * @default false
     */
    enabled: boolean;

    /**
     * Maximum number of retry attempts
     * @default 5
     */
    maxRetries?: number;

    /**
     * Delay between retry attempts in milliseconds
     * @default 3000
     */
    retryDelay?: number;
  };
}

/**
 * Language codes supported by the translation API
 */
export type LanguageCode =
  | 'en'  // English
  | 'es'  // Spanish
  | 'fr'  // French
  | 'de'  // German
  | 'it'  // Italian
  | 'pt'  // Portuguese
  | 'ru'  // Russian
  | 'zh'  // Chinese
  | 'ja'  // Japanese
  | 'ko'; // Korean

/**
 * Sentiment Analysis Result
 */
export interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEGATIVE';
  score: number;
  confidence: number;
  is_confident: boolean;
  confidence_threshold: number;
}

/**
 * Image Generation Mode
 */
export type ImageGenerationMode = 'fast' | 'standard';

/**
 * Image Generation Options
 */
export interface ImageGenerationOptions {
  /**
   * Generation mode
   * @default "standard"
   */
  mode?: ImageGenerationMode;

  /**
   * Things to avoid in the generation
   */
  negativePrompt?: string;

  /**
   * Image width (512-1024)
   * @default 1024
   */
  width?: number;

  /**
   * Image height (512-1024)
   * @default 1024
   */
  height?: number;

  /**
   * How closely to follow the prompt (1-20)
   * @default 7.5
   */
  guidance?: number;

  /**
   * Seed for reproducible results
   */
  seed?: number;
}

export interface BaseClient {
    getApiKey(): string;
    getBaseUrl(): string;
    post<T>(endpoint: string, body: unknown): Promise<T>;
    get<T>(endpoint: string): Promise<T>;
    delete<T>(endpoint: string, body?: unknown): Promise<T>;
}

export interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: null;
    finish_reason: string;
  }>;
  usage: ApiUsage;
}

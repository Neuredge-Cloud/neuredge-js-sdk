import { BaseCapability } from './base';
import { 
  type VectorIndex, 
  type Vector, 
  type SearchVectorMatch,
  type VectorOptions,
  type ApiResponse,
  type VectorIndexResponse,
  type ListVectorIndexesResult,
  type AddVectorsResult,
  type SearchVectorResult,
  NeuredgeError
} from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class VectorStoreCapabilities extends BaseCapability {
  protected get basePath(): string {
    return '/v1';  // Vector store endpoints use v1 prefix
  }

  /**
   * Create a new vector index
   * @param config Vector index configuration
   */
  async createIndex(config: VectorIndex): Promise<void> {
    try {
      await this.client.post(this.endpoint('/indexes'), config);
      // Wait briefly to allow index creation to propagate
      await sleep(1000);
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all vector indexes
   */
  async listIndexes(): Promise<VectorIndex[]> {
    const response = await this.client.get<{ indexes: VectorIndexResponse[] }>(
      this.endpoint('/indexes')
    );
   
    // Handle direct response structure without result wrapper
    const indexesData = response.indexes || [];
    
    return indexesData.map(index => ({
      name: index.name,
      dimension: index.dimension,
      metric: 'cosine',
      vector_count: index.vector_count
    }));
  }

  /**
   * Get details of a specific index
   * @param name Name of the index
   */
  async getIndex(name: string): Promise<VectorIndex | null> {
    try {
      const response = await this.client.get<VectorIndexResponse>(
        this.endpoint(`/indexes/${name}`)
      );
      
      if (!response) {
        return null;
      }

      // Ensure we have all required properties before creating VectorIndex
      if (!('name' in response) || !('dimension' in response)) {
        console.warn('Invalid index response format:', response);
        return null;
      }

      return {
        name: response.name,
        dimension: response.dimension,
        metric: 'cosine',
        vector_count: response.vector_count ?? 0
      };
    } catch (error) {
      if (error instanceof NeuredgeError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete a vector index
   * @param name Name of the index to delete
   */
  async deleteIndex(name: string): Promise<void> {
    try {
      await this.client.delete(this.endpoint(`/indexes/${name}`));
    } catch (error) {
      // Ignore 404 errors during cleanup
      if (error instanceof NeuredgeError && error.statusCode === 404) {
        return;
      }
      throw error;
    }
  }

  /**
   * Store vectors in an index
   * @param indexName Name of the index
   * @param vectors Array of vectors to store
   * @param options Vector operation options
   */
  async addVectors(
    indexName: string, 
    vectors: Vector[],
    options: VectorOptions = {}
  ): Promise<AddVectorsResult> {
    // Get current count if consistency mode is enabled
    let beforeCount = 0;
    if (options.consistency?.enabled) {
      const index = await this.getIndex(indexName);
      if (!index) {
        throw new NeuredgeError(
          `Index ${indexName} not found`,
          'INDEX_NOT_FOUND',
          404
        );
      }
      beforeCount = index.vector_count ?? 0;
    }

    // Store vectors and handle response type
    const response = await this.client.post<AddVectorsResult>(
      this.endpoint(`/indexes/${indexName}/vectors`), 
      { vectors }
    );

    // Ensure response has required properties
    if (!response || typeof response.inserted !== 'number') {
      throw new NeuredgeError(
        'Invalid response from add vectors',
        'INVALID_RESPONSE',
        500
      );
    }

    // Wait for vectors to be indexed if consistency mode is enabled
    if (options.consistency?.enabled) {
      const expectedCount = beforeCount + vectors.length;
      const maxRetries = options.consistency.maxRetries ?? 5;
      const retryDelay = options.consistency.retryDelay ?? 3000;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const index = await this.getIndex(indexName);
        if (index && index.vector_count === expectedCount) {
          break;
        }
        if (attempt < maxRetries - 1) {
          await sleep(retryDelay);
        }
      }
    }

    return {
      inserted: response.inserted,
      ids: response.ids || []
    };
  }

  /**
   * Delete vectors from an index
   * @param indexName Name of the index
   * @param ids Array of vector IDs to delete
   */
  async deleteVectors(
    indexName: string, 
    ids: (string | number)[]
  ): Promise<void> {
    return this.client.delete(this.endpoint(`/indexes/${indexName}/vectors`), { ids });
  }

  /**
   * Search for similar vectors
   * @param indexName Name of the index
   * @param vector Query vector
   * @param options Search and consistency options
   */
  async searchVector(
    indexName: string,
    vector: number[],
    options: VectorOptions = {}
  ): Promise<SearchVectorMatch[]> {
    const maxRetries = options.consistency?.maxRetries ?? 1;
    const retryDelay = options.consistency?.retryDelay ?? 0;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.client.post<{ results: SearchVectorMatch[] }>(
          this.endpoint(`/indexes/${indexName}/search`),
          {
            vector,
            limit: options.topK ?? 10,
          }
        );
        
        
        // If we have results, return them immediately
        if (response.results && response.results.length > 0) {
          return response.results;
        }
        
        // Only retry if we have no results and consistency is enabled
        if (!options.consistency?.enabled) {
          return response.results || [];
        }

        if (attempt < maxRetries - 1) {
          console.warn(`Search attempt ${attempt + 1}/${maxRetries}: No results, retrying...`);
          await sleep(retryDelay);
        }
      } catch (error) {
        console.error(`Search attempt ${attempt + 1} failed:`, error);
        if (attempt === maxRetries - 1) {
          throw error;
        }
        await sleep(retryDelay);
      }
    }

    return [];
  }
}

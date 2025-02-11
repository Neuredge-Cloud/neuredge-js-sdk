import Neuredge from '../../src';
import { config } from '../config';
import { log, logTest } from '../utils';
import type { VectorIndex } from '../../src/types';

export async function vectorTests() {
  const neuredge = new Neuredge(config);
  const testIndex = {
    name: `test-${Date.now()}`,
    dimension: 128, // Update to a valid dimension within [32, 1536]
    metric: 'cosine' as const
  };

  try {
    await logTest('Vector store - create index', async () => {
      await neuredge.vector.createIndex(testIndex);
      await sleep(2000); // Wait longer for index creation

      const indexes = await neuredge.vector.listIndexes();
      log('Available indexes:', JSON.stringify(indexes, null, 2));
      return indexes.some(index => index.name === testIndex.name);
    });

    await logTest('Vector store - add vectors', async () => {
      const options = {
        consistency: {
          enabled: true,
          maxRetries: 3,
          retryDelay: 1000
        }
      };

      const result = await neuredge.vector.addVectors(
        testIndex.name,
        [{
          id: 'test1',
          values: new Array(128).fill(0.1) // Update array length to match dimension
        }],
        options
      );
      log('Add vectors result:', result);
      return result && result.inserted === 1;
    });

    await logTest('Vector store - search vectors', async () => {
      // Add delay before search to allow indexing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const results = await neuredge.vector.searchVector(
        testIndex.name,
        new Array(128).fill(0.1), // Update array length to match dimension
        {
          topK: 1,
          consistency: {
            enabled: true,
            maxRetries: 6,
            retryDelay: 3000
          }
        }
      );
      log('Search results:', results);
      return Array.isArray(results) && results.length > 0;
    });
  } finally {
    // Cleanup in finally block to ensure it runs
    try {
      await neuredge.vector.deleteIndex(testIndex.name);
    } catch (error) {
      console.error('Failed to clean up test index:', error);
    }
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

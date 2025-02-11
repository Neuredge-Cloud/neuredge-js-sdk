import Neuredge from '../dist';
import { VectorIndex, VectorOptions } from '../src/types';

async function main() {
    try {
        // Initialize the client
        const neuredge = new Neuredge({
            apiKey: 'nrkey_239f055f1a3acc1b576e91e6489b7a6c',
            baseUrl: 'http://127.0.0.1:8787/v1'
        });

        // Create a test index with timestamp
        const indexName = `test-${Date.now()}`;
        
        const indexConfig: VectorIndex = {
            name: indexName,
            dimension: 32,
            metric: 'cosine' as const
        };
                
        await neuredge.vector.createIndex(indexConfig);

        // List indexes to confirm creation
        const indexes = await neuredge.vector.listIndexes();

        // Add test vectors with confirmation
        const testVectors = [
            {
                id: "vec1",
                values: new Array(32).fill(0.1)
            },
            {
                id: "vec2",
                values: new Array(32).fill(0.2)
            }
        ];
        console.log('Test vectors:', JSON.stringify(testVectors, null, 2));
        
        const addResult = await neuredge.vector.addVectors(indexName, testVectors);
        console.log('Add vectors result:', addResult);

        // Initial search with exponential backoff
        console.log('\n4. Performing similarity search with retry...');
        const queryVector = new Array(32).fill(0.15);
        console.log('Query vector:', queryVector);
        
        const searchOptions: VectorOptions = { 
            topK: 2,
            consistency: {
                enabled: true,
                maxRetries: 5,
                retryDelay: 3000
            }
        };
        
        const searchResults = await neuredge.vector.searchVector(
            indexName,
            queryVector,
            searchOptions
        );
        console.log('Search results:', JSON.stringify(searchResults, null, 2));

        // Delete specific vectors with confirmation
        console.log('\n5. Deleting vector "vec1"...');
        await neuredge.vector.deleteVectors(indexName, ["vec1"]);
        console.log('Vector deleted');

        // Search again after deletion
        console.log('\n6. Searching again after deletion...');
        const newResults = await neuredge.vector.searchVector(
            indexName,
            queryVector,
            searchOptions
        );
        console.log('New search results:', JSON.stringify(newResults, null, 2));

        // Clean up
        console.log('\n7. Cleaning up - deleting test index...');
        await neuredge.vector.deleteIndex(indexName);
        console.log('Index deleted');

        // Verify final state
        console.log('\n8. Final state - listing remaining indexes...');
        const remainingIndexes = await neuredge.vector.listIndexes();
        console.log('Remaining indexes:', JSON.stringify(remainingIndexes, null, 2));

    } catch (error) {
        console.error('\nError occurred:', error);
        // Log full error details
        if (
            error && 
            typeof error === 'object' && 
            'response' in error &&
            error.response && 
            typeof error.response === 'object'
        ) {
            const apiError = error.response as { data?: unknown; status?: number };
            if (apiError.data) console.error('Response data:', apiError.data);
            if (apiError.status) console.error('Response status:', apiError.status);
        }
        throw error;
    }
}

main().catch(error => {
    console.error('\nFatal error:', error);
});

/**
 * This file contains examples of how to use the Neuredge SDK in a Node.js environment.
 */


/**
 * if you are using the package
 */
import { Neuredge } from '@neuredge/sdk';


/**
 * If you are building locally, you can use the following import statement
 */
import {Neuredge} from '../dist/index.js';

// Since we're using ES modules, we need to use top-level await
// or wrap our code in an async IIFE (Immediately Invoked Function Expression)

const main = async () => {
    const neuredge = new Neuredge({
        apiKey: 'dae36084-c9cb-4481-9e71-d6474d3b2680'
    });

    async function testOpenAICompletions() {
        console.log('\n=== Testing OpenAI Chat Completions ===');
        const completion = await neuredge.openai.chat.completions.create({
            model: '@cf/meta/llama-2-7b-chat-fp16',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Hello!' }
            ],
            temperature: 0.7,
            max_tokens: 500
        });
        console.log('Standard completion:', JSON.stringify(completion, null, 2));

        console.log('\nTesting streaming completion...');
        const stream = await neuredge.openai.chat.completions.create({
            model: '@cf/meta/llama-3.1-70b-instruct',
            messages: [{ role: 'user', content: 'Count to 5' }],
            stream: true
        });

        process.stdout.write('Streaming response: ');
        for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || '');
        }
        console.log('\n');
    }

    async function testEmbeddings() {
        console.log('\n=== Testing Embeddings ===');
        const embeddings = await neuredge.openai.embeddings.create({
            model: '@cf/baai/bge-small-en-v1.5',
            input: ['Hello, world!', 'Testing embeddings']
        });
        console.log('Embeddings:', JSON.stringify(embeddings.data[0].embedding.slice(0, 5), null, 2), '...');
    }

    async function testTextCapabilities() {
        console.log('\n=== Testing Text Capabilities ===');

        const text = "This is a long piece of text that needs to be summarized. It contains multiple sentences about various topics. The weather is nice today. AI technology is advancing rapidly.";
        const summary = await neuredge.text.summarize(text);
        console.log('Summary:', summary);

        const translated = await neuredge.text.translate(
            'Hello world',
            'es',
            'en'
        );
        console.log('Translation:', translated);

        const sentiment = await neuredge.text.analyzeSentiment(
            'I love this product, it works great!'
        );
        console.log('Sentiment:', sentiment);
    }

    async function testVectorStore() {
        console.log('\n=== Testing Vector Store Operations ===');

        const indexName = `test-vectors-${Date.now()}`; // Make index name unique
        const dimension = 384; // Using BGE small dimension

        // Helper function to wait
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            // List existing indexes first
            const indexes = await neuredge.vector.listIndexes();
            console.log('Current indexes:', indexes.map(idx => idx.name));

            // Create index
            console.log(`Creating index: ${indexName}`);
            await neuredge.vector.createIndex({
                name: indexName,
                dimension,
                metric: 'cosine'
            });
            console.log('Index created');

            // Wait for index to be ready
            await wait(2000);

            // Verify index exists
            const index = await neuredge.vector.getIndex(indexName);
            if (!index) {
                throw new Error('Index was not created properly');
            }
            console.log('Index verified:', index);

            // Add vectors
            const vectors = [
                {
                    id: '1',
                    values: new Array(dimension).fill(0.1)
                },
                {
                    id: '2',
                    values: new Array(dimension).fill(0.2)
                }
            ];

            console.log('Adding vectors...');
            const addResult = await neuredge.vector.addVectors(indexName, vectors, {
                consistency: {
                    enabled: true,
                    maxRetries: 3,
                    retryDelay: 1000
                }
            });
            console.log('Vectors added:', addResult);

            // Wait for vectors to be indexed
            await wait(2000);

            // Search vectors
            console.log('Searching vectors...');
            const searchResults = await neuredge.vector.searchVector(
                indexName,
                new Array(dimension).fill(0.1),
                {
                    topK: 2,
                    consistency: {
                        enabled: true
                    }
                }
            );
            console.log('Search results:', searchResults);

            // Clean up - with retry logic
            console.log('Cleaning up...');
            let deleted = false;
            for (let i = 0; i < 3; i++) {
                try {
                    await neuredge.vector.deleteIndex(indexName);
                    deleted = true;
                    console.log('Index deleted successfully');
                    break;
                } catch (err) {
                    console.log(`Delete attempt ${i + 1} failed, retrying...`);
                    await wait(2000);
                }
            }
            if (!deleted) {
                console.log('Warning: Could not delete index');
            }

        } catch (error) {
            if (error.code === 'UNKNOWN_ERROR' && error.statusCode === 400) {
                console.error('Vector store error:', {
                    message: error.message,
                    code: error.code,
                    status: error.statusCode
                });
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }

    async function testImageGeneration() {
        console.log('\n=== Testing Image Generation ===');
        
        try {
            // Test fast generation
            console.log('Testing fast image generation...');
            const fastImage = await neuredge.image.generateFast(
                'A simple sketch of a cat'
            );
            console.log('Fast image generated:', fastImage instanceof Blob);

            // Test standard generation with options
            console.log('\nTesting standard image generation...');
            const standardImage = await neuredge.image.generate(
                'A magical forest with glowing mushrooms',
                {
                    mode: 'standard',
                    width: 1024,
                    height: 768,
                    guidance: 8.5,
                    negativePrompt: 'dark, scary, spooky'
                }
            );
            console.log('Standard image generated:', standardImage instanceof Blob);

            // Save images to files for verification
            const fastImagePath = `fast-image-${Date.now()}.png`;
            const standardImagePath = `standard-image-${Date.now()}.png`;

            // Using Node.js fs promises to save the images
            const fs = await import('fs/promises');
            
            await fs.writeFile(fastImagePath, Buffer.from(await fastImage.arrayBuffer()));
            console.log(`Fast image saved to: ${fastImagePath}`);
            
            await fs.writeFile(standardImagePath, Buffer.from(await standardImage.arrayBuffer()));
            console.log(`Standard image saved to: ${standardImagePath}`);

        } catch (error) {
            console.error('Image generation error:', error);
        }
    }

    async function runTests() {
        try {
            await testOpenAICompletions();
            await testEmbeddings();
            await testTextCapabilities();
            await testVectorStore();
            await testImageGeneration();
        } catch (error) {
            if (error.code) {
                console.error('API Error:', {
                    message: error.message,
                    code: error.code,
                    statusCode: error.statusCode
                });
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }

    await runTests();
};

// Execute the main function
main().catch(console.error);
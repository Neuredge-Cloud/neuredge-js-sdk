# Neuredge JavaScript SDK

A powerful JavaScript/TypeScript SDK for AI applications with OpenAI compatibility.

## Installation

```bash
npm install @neuredge/sdk
```

## Quick Start

```typescript
import { Neuredge } from '@neuredge/sdk';

const neuredge = new Neuredge({
  apiKey: 'your-api-key'
});

// OpenAI-compatible chat completion
const completion = await neuredge.openai.chat.completions.create({
  model: '@cf/meta/llama-2-7b-chat-fp16',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ]
});

// Text capabilities
const summary = await neuredge.text.summarize('Long text to summarize...');
```

## Available Models

### Chat Models

#### Llama Models
- **Llama 2 Series**
  - `@cf/meta/llama-2-7b-chat-fp16` - 7B parameter model
  - `@cf/meta/llama-2-7b-chat-int8` - 7B parameter quantized model

- **Llama 3 Series**
  - `@cf/meta/llama-3-8b-instruct` - Base 8B model
  - `@cf/meta/llama-3-8b-instruct-awq` - 8B AWQ quantized
  - `@cf/meta/llama-3.1-8b-instruct` - Latest 8B with JSON support
  - `@cf/meta/llama-3.1-8b-instruct-awq` - Latest 8B AWQ quantized
  - `@cf/meta/llama-3.1-8b-instruct-fp8` - 8B FP8 quantized
  - `@cf/meta/llama-3.1-8b-instruct-fast` - Optimized for speed
  - `@cf/meta/llama-3.1-70b-instruct` - Large 70B model
  - `@cf/meta/llama-3.2-1b-instruct` - Compact 1B model
  - `@cf/meta/llama-3.2-3b-instruct` - Efficient 3B model

- **Vision Models**
  - `@cf/meta/llama-3.2-11b-vision` - 11B multimodal model
  - `@cf/meta/llama-3.2-90b-vision` - 90B multimodal model

#### Mistral Models
- `@cf/mistral/mistral-7b-instruct-v0.1` - Original 7B model
- `@hf/mistral/mistral-7b-instruct-v0.2` - Improved 7B model
- `@cf/mistral/mistral-7b-instruct-v0.2-lora` - LoRA-enabled version

#### Qwen Models
- `@cf/qwen/qwen1.5-0.5b-chat` - Compact 0.5B model
- `@cf/qwen/qwen1.5-1.8b-chat` - Small 1.8B model
- `@cf/qwen/qwen1.5-7b-chat-awq` - 7B AWQ quantized
- `@cf/qwen/qwen1.5-14b-chat-awq` - 14B AWQ quantized

#### Google Models
- `@cf/google/gemma-2b-it-lora` - 2B LoRA-enabled
- `@cf/google/gemma-7b-it-lora` - 7B LoRA-enabled
- `@hf/google/gemma-7b-it` - Standard 7B model

#### Specialized Models
- `@cf/microsoft/phi-2` - General purpose
- `@cf/openchat/openchat-3.5-0106` - ChatGPT-like
- `@cf/deepseek-ai/deepseek-math-7b-instruct` - Math specialized
- `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` - Distilled 32B
- `@cf/tinyllama/tinyllama-1.1b-chat-v1.0` - Ultra-compact

### Embedding Models

#### BGE Models
- `@cf/baai/bge-base-en-v1.5`
  - Dimensions: 768
  - Best for: General purpose
  - Max tokens: 8191

- `@cf/baai/bge-large-en-v1.5`
  - Dimensions: 1024
  - Best for: High accuracy
  - Max tokens: 8191

- `@cf/baai/bge-small-en-v1.5`
  - Dimensions: 384
  - Best for: Efficiency
  - Max tokens: 8191

#### Model Features

| Model Type | Context Window | Features |
|------------|---------------|-----------|
| Llama 3.1 70B | 8192 | JSON mode, Function calling, Streaming |
| Llama 3.1 8B | 8192 | Multilingual, Streaming |
| Llama 3.2 Vision | 128000 | Image understanding, Multilingual |
| Mistral 7B | 8192 | Streaming, LoRA fine-tuning |
| Qwen 14B | 8192 | Multilingual, Streaming |
| BGE Embeddings | 8191 | Semantic search, Cross-lingual |

## OpenAI Compatibility Layer

### Chat Completions

```typescript
// Standard chat completion
const chat = await neuredge.openai.chat.completions.create({
  model: '@cf/meta/llama-2-7b-chat-fp16',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is AI?' }
  ],
  temperature: 0.7,
  max_tokens: 500
});

// Streaming chat completion
const stream = await neuredge.openai.chat.completions.create({
  model: '@cf/meta/llama-3.1-70b-instruct',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### Embeddings

```typescript
const embeddings = await neuredge.openai.embeddings.create({
  model: '@cf/baai/bge-large-en-v1.5',
  input: ['Hello world', 'Another text']
});

console.log(embeddings.data[0].embedding); // Vector representation
```

## Features

### Text Processing

```typescript
// Summarization
const summary = await neuredge.text.summarize(longText);

// Translation
const translated = await neuredge.text.translate(
  'Hello world',
  'es',  // target language
  'en'   // source language (optional)
);

// Sentiment analysis
const sentiment = await neuredge.text.analyzeSentiment(
  'I love this product, it works great!'
);
console.log(sentiment.sentiment); // 'POSITIVE' or 'NEGATIVE'
console.log(sentiment.confidence); // confidence score
```

### Vector Store Operations

```typescript
// Create an index
await neuredge.vector.createIndex({
  name: 'my-vectors',
  dimension: 384, // Using BGE small dimension
  metric: 'cosine'
});

// Add vectors
const addResult = await neuredge.vector.addVectors('my-vectors', [
  {
    id: '1',
    values: new Array(384).fill(0.1)
  }
], {
  consistency: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000
  }
});

// Search vectors
const searchResults = await neuredge.vector.searchVector(
  'my-vectors',
  new Array(384).fill(0.1),
  {
    topK: 10,
    consistency: {
      enabled: true
    }
  }
);
```

### Image Generation

```typescript
// Fast mode - Quick generation with default settings
const fastImage = await neuredge.image.generateFast(
  'A simple sketch of a cat'
);

// Standard mode with full options
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

// Save the generated images (Node.js example)
const fs = await import('fs/promises');
await fs.writeFile('image.png', Buffer.from(await standardImage.arrayBuffer()));
```

## API Reference

### Client Configuration

```typescript
interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
}
```

### Vector Store Types

```typescript
interface VectorIndex {
  name: string;
  dimension: number;
  metric: 'cosine' | 'euclidean' | 'dot';
}

interface Vector {
  id: string | number;
  values: number[];
}

interface VectorOptions {
  topK?: number;
  consistency?: {
    enabled: boolean;
    maxRetries?: number;
    retryDelay?: number;
  };
}
```

### Response Types

```typescript
interface ChatCompletion {
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
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface Embedding {
  object: 'embedding';
  data: Array<{
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}
```

### Image Generation Options

```typescript
interface ImageGenerationOptions {
  mode?: 'fast' | 'standard';  // Generation mode
  width?: number;              // 512-1024px
  height?: number;             // 512-1024px
  guidance?: number;           // 1-20, controls prompt adherence
  negativePrompt?: string;     // Things to avoid in generation
  seed?: number;               // For reproducible results
}
```

## Error Handling

```typescript
try {
  await neuredge.text.generate('...');
} catch (error) {
  if (error instanceof NeuredgeError) {
    console.error({
      message: error.message,
      code: error.code,
      status: error.statusCode
    });
  }
}
```

## Rate Limits

- Free tier: 60 requests per minute
- Pro tier: 600 requests per minute
- Enterprise: Custom limits

## Best Practices

1. **Error Handling**: Always implement proper error handling
2. **Streaming**: Use streaming for long responses
3. **Resource Management**: Close connections properly
4. **Security**: Never expose your API key in client-side code

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Support

- Documentation: https://docs.neuredge.dev
- Issues: https://github.com/neuredge/js-sdk/issues
- Email: support@neuredge.dev

## License

MIT License - see [LICENSE](LICENSE) file for details.
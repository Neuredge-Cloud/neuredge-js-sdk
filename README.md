# Neuredge JavaScript SDK

A powerful JavaScript/TypeScript SDK for AI applications with OpenAI compatibility.

## Installation

```bash
npm install @neuredge/sdk
```

## Quick Start

```typescript
import Neuredge from '@neuredge/sdk';

const neuredge = new Neuredge({
  apiKey: 'your-api-key',
});

// OpenAI-compatible chat completion
const completion = await neuredge.chat.completions.create({
  model: 'llama-70b',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ]
});

// Native text generation
const response = await neuredge.text.generate(
  'Write a short story about a robot.'
);
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
const chat = await neuredge.chat.completions.create({
  model: 'llama-70b',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is AI?' }
  ],
  temperature: 0.7,
  max_tokens: 500
});

// Streaming chat completion
const stream = await neuredge.chat.completions.create({
  model: 'llama-70b',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### Embeddings

```typescript
const embeddings = await neuredge.embeddings.create({
  model: 'bge-large',
  input: ['Hello world', 'Another text']
});

console.log(embeddings.data[0].embedding); // Vector representation
```

## Native Features

### Text Generation

```typescript
// Basic generation
const text = await neuredge.text.generate('Write a poem');

// Advanced options
const customText = await neuredge.text.generate('Write a story', {
  model: 'llama-70b',
  temperature: 0.8,
  maxTokens: 1000,
  stopSequences: ['\n\n'],
  format: 'markdown'
});
```

### Text Analysis

```typescript
// Summarization
const summary = await neuredge.text.summarize(longText);

// Translation
const translated = await neuredge.text.translate(
  'Hello world',
  'es',
  'en'
);

// Sentiment analysis
const sentiment = await neuredge.text.analyzeSentiment(text);
```

### Vector Operations

```typescript
// Create embeddings
const vector = await neuredge.vector.embed('Your text here');

// Similarity search
const similar = await neuredge.vector.findSimilar(vector, {
  collection: 'my-vectors',
  limit: 5
});

// Vector storage
await neuredge.vector.store(vector, {
  id: 'doc1',
  collection: 'my-vectors',
  metadata: { source: 'article' }
});
```

## API Reference

### Client Configuration

```typescript
interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}
```

### Models

Available models for different tasks:

```typescript
// Chat models
type ChatModel = 'llama-70b' | 'llama-8b' | 'mistral-7b';

// Embedding models
type EmbeddingModel = 'bge-base' | 'bge-small' | 'bge-large';
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
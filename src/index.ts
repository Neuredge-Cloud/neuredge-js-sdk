import { NeuredgeClient } from './client';
import { TextCapabilities } from './capabilities/text';
import { ImageCapabilities } from './capabilities/image';
import { VectorStoreCapabilities } from './capabilities/vector';
import { OpenAINamespace } from './openai';
import type {
  ClientConfig,
  LanguageCode,
  SentimentResult,
  ImageGenerationMode,
  ImageGenerationOptions,
  // Add text-related types
  ApiMetadata,
  ApiUsage,
  ApiQuota,
  ApiResponse,
  SummaryResult,
  TranslationResult,
  // Vector-related types
  VectorIndex,
  Vector,
  SearchVectorMatch,
  SearchVectorResult,
  VectorOptions,
  VectorIndexResponse,
  ListVectorIndexesResult,
  AddVectorsResult,
} from './types';
export { NeuredgeError } from './types';

export class Neuredge {
  private readonly client: NeuredgeClient;
  readonly text: TextCapabilities;
  readonly image: ImageCapabilities;
  readonly vector: VectorStoreCapabilities;
  readonly openai: OpenAINamespace;

  constructor(config: ClientConfig) {
    this.client = new NeuredgeClient(config);
    this.text = new TextCapabilities(this.client);
    this.image = new ImageCapabilities(this.client);
    this.vector = new VectorStoreCapabilities(this.client);
    this.openai = new OpenAINamespace(this.client);
  }
}

// Export types
export type {
  ClientConfig,
  LanguageCode,
  SentimentResult,
  ImageGenerationMode,
  ImageGenerationOptions,
  // Add text-related types
  ApiMetadata,
  ApiUsage,
  ApiQuota,
  ApiResponse,
  SummaryResult,
  TranslationResult,
  // Vector-related types
  VectorIndex,
  Vector,
  SearchVectorMatch,
  SearchVectorResult,
  VectorOptions,
  VectorIndexResponse,
  ListVectorIndexesResult,
  AddVectorsResult,
};

// Default export
export default Neuredge;

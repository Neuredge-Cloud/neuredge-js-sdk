import { OpenAICapability } from './base';
import OpenAI from 'openai';
import type { EmbeddingCreateParams } from 'openai/resources/embeddings';
import type { BaseClient } from '../types';

export class Embeddings extends OpenAICapability {
    private openai: OpenAI;

    constructor(client: BaseClient) {
        super(client);
        this.openai = new OpenAI({
            apiKey: client.getApiKey(),
            baseURL: client.getBaseUrl() + this.basePath
        });
    }

    async create(params: EmbeddingCreateParams) {
        return this.openai.embeddings.create(params);
    }
}

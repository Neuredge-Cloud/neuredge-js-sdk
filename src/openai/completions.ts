import OpenAI from 'openai';
import type { Stream } from 'openai/streaming';
import type { BaseClient } from '../types';
import type { 
  ChatCompletionCreateParamsBase,
  ChatCompletion,
  ChatCompletionChunk
} from 'openai/resources/chat/completions';
import { OpenAICapability } from './base';

export class ChatCompletions extends OpenAICapability {
    private openai: OpenAI;

    constructor(client: BaseClient) {
        super(client);
        this.openai = new OpenAI({
            apiKey: client.getApiKey(),
            baseURL: client.getBaseUrl() + this.basePath
        });
    }

    async create(
        params: Omit<ChatCompletionCreateParamsBase, 'stream'> & { stream?: false }
    ): Promise<ChatCompletion>;
    async create(
        params: ChatCompletionCreateParamsBase & { stream: true }
    ): Promise<Stream<ChatCompletionChunk>>;
    async create(
        params: ChatCompletionCreateParamsBase
    ): Promise<ChatCompletion | Stream<ChatCompletionChunk>> {
        return this.openai.chat.completions.create({
            ...params,
            // Ensure we're using v1 path for OpenAI-compatible endpoints
            model: params.model
        });
    }

    createStream(
        params: ChatCompletionCreateParamsBase & { stream: true }
    ): Promise<Stream<ChatCompletionChunk>> {
        return this.openai.chat.completions.create(params);
    }
}

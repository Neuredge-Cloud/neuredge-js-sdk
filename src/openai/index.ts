import { ChatCompletions } from './completions';
import { Embeddings } from './embeddings';
import { BaseCapability } from '../capabilities/base';
import type { BaseClient } from '../types';

export class OpenAINamespace extends BaseCapability {
  readonly chat: {
    completions: ChatCompletions;
  };
  readonly embeddings: Embeddings;

  constructor(client: BaseClient) {
    super(client);
    this.chat = {
      completions: new ChatCompletions(client)
    };
    this.embeddings = new Embeddings(client);
  }
}

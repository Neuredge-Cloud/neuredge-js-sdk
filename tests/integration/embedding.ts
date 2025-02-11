import Neuredge from '../../src';
import { config } from '../config';
import { logTest } from '../utils';

export async function embeddingTests() {
  const neuredge = new Neuredge(config);

  await logTest('Embeddings - single input', async () => {
    const embedding = await neuredge.openai.embeddings.create({
      model: '@cf/baai/bge-base-en-v1.5',
      input: 'Hello world'
    });
    return embedding.data[0].embedding.length === 768;
  });

  await logTest('Embeddings - batch input', async () => {
    const embedding = await neuredge.openai.embeddings.create({
      model: '@cf/baai/bge-base-en-v1.5',
      input: ['Hello world', 'Test embedding']
    });
    return embedding.data.length === 2;
  });
}

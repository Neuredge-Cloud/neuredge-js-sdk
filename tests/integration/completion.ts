import Neuredge from '../../src';
import { config } from '../config';
import { logTest } from '../utils';

export async function completionTests() {
  const neuredge = new Neuredge(config);

  await logTest('Chat completion - basic', async () => {
    const completion = await neuredge.openai.chat.completions.create({
      model: '@cf/meta/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: 'Hello, how are you?' }]
    });
    
    const content = completion.choices?.[0]?.message?.content;
    return typeof content === 'string' && content.length > 0;
  });

  await logTest('Chat completion - streaming', async () => {
    const stream = await neuredge.openai.chat.completions.createStream({
      model: '@cf/meta/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: 'Count to 5' }],
      stream: true
    });

    let content = '';
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        content += delta;
      }
    }
    return content.length > 0;
  });
}

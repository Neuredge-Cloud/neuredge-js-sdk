import Neuredge from '../../src';
import { config } from '../config';
import { log, logTest } from '../utils';

export async function textTests() {
  const neuredge = new Neuredge(config);

  await logTest('Text summarization', async () => {
    const summary = await neuredge.text.summarize(
      'Workers AI allows you to run machine learning models, on the Cloudflare network, from your own code.'
    );
    log("Summary", summary);
    return typeof summary === 'string' && summary.length > 0;
  });

  await logTest('Text translation', async () => {
    const translation = await neuredge.text.translate(
      'Hello, how are you?',
      'es',
      'en'
    );
    log("translation", translation);
    
    return typeof translation === 'string' && translation.length > 0;
  });

  await logTest('Sentiment analysis', async () => {
    const sentiment = await neuredge.text.analyzeSentiment(
      'I absolutely love this product!'
    );
    log("sentiment", sentiment);
    return sentiment.sentiment === 'POSITIVE' && sentiment.confidence > 0;
  });
}

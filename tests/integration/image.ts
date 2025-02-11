import Neuredge from '../../src';
import { config } from '../config';
import { logTest } from '../utils';

export async function imageTests() {
  const neuredge = new Neuredge(config);

  await logTest('Image generation - standard', async () => {
    const image = await neuredge.image.generate(
      'A serene mountain landscape at sunset',
      { mode: 'standard' }
    );
    return image instanceof Blob;
  });

  await logTest('Image generation - fast', async () => {
    const image = await neuredge.image.generateFast(
      'A simple sketch of a cat'
    );
    return image instanceof Blob;
  });

  await logTest('Image generation - with options', async () => {
    const image = await neuredge.image.generate(
      'A magical forest with glowing mushrooms',
      {
        mode: 'standard',
        width: 1024,
        height: 768,
        guidance: 8.5,
        negativePrompt: 'dark, scary, spooky'
      }
    );
    return image instanceof Blob;
  });
}

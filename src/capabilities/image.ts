import { BaseCapability } from './base';
import type { ImageGenerationOptions } from '../types';

export class ImageCapabilities extends BaseCapability {
  protected get basePath(): string {
    return '/image';  // Image endpoints use /image prefix
  }

  async generate(prompt: string, options: ImageGenerationOptions = {}): Promise<Blob> {
    return this.client.post<Blob>(this.endpoint('/generate'), {
      prompt,
      mode: options.mode ?? 'standard',
      negative_prompt: options.negativePrompt,
      width: options.width ?? 1024,
      height: options.height ?? 1024,
      guidance: options.guidance ?? 7.5,
      seed: options.seed,
    });
  }

  async generateFast(prompt: string, options: Omit<ImageGenerationOptions, 'mode'> = {}): Promise<Blob> {
    return this.generate(prompt, { ...options, mode: 'fast' });
  }

  async generateStandard(prompt: string, options: Omit<ImageGenerationOptions, 'mode'> = {}): Promise<Blob> {
    return this.generate(prompt, { ...options, mode: 'standard' });
  }
}
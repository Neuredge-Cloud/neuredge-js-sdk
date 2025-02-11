import { BaseCapability } from './base';
import type { ImageGenerationMode, ImageGenerationOptions } from '../types';

export class ImageCapabilities extends BaseCapability {
    protected get basePath(): string {
        return '/image';
    }

    /**
     * Generate an image based on a text prompt
     * @param prompt Text description of the desired image
     * @param options Generation options
     * @returns Promise<Blob> The generated image
     */
    async generate(prompt: string, options?: ImageGenerationOptions): Promise<Blob> {
        const response = await this.client.post<BlobPart>(this.endpoint('/generate'), {
            prompt,
            ...options
        });
        return new Blob([response], { type: 'image/png' });
    }

    /**
     * Quick image generation with simplified options
     * @param prompt Text description of the desired image
     * @param options Options (excluding mode)
     * @returns Promise<Blob> The generated image
     */
    async generateFast(prompt: string, options?: Omit<ImageGenerationOptions, 'mode'>): Promise<Blob> {
        return this.generate(prompt, { ...options, mode: 'fast' });
    }

    /**
     * Standard image generation with full quality
     * @param prompt Text description of the desired image
     * @param options Options (excluding mode)
     * @returns Promise<Blob> The generated image
     */
    async generateStandard(prompt: string, options?: Omit<ImageGenerationOptions, 'mode'>): Promise<Blob> {
        return this.generate(prompt, { ...options, mode: 'standard' });
    }
}
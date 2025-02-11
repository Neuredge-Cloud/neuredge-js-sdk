import { NeuredgeClient } from '../client';
import { BaseCapability } from './base';
import type { 
  LanguageCode, 
  SentimentResult, 
  ApiResponse, 
  SummaryResult,
  TranslationResult 
} from '../types';

export class TextCapabilities extends BaseCapability {
  constructor(client: NeuredgeClient) {
    super(client);
  }

  protected get basePath(): string {
    return ''; // Add text prefix for text endpoints
  }

  /**
   * Generate a summary of the provided text
   * @param text The text to summarize
   * @returns A concise summary of the input text
   */
  async summarize(text: string): Promise<string> {
    const response = await this.client.post<ApiResponse<SummaryResult>>(
      this.endpoint('/summarize'), 
      { text }
    );
    return response.result.summary;
  }

  /**
   * Translate text from one language to another
   * @param text The text to translate
   * @param targetLang The target language code
   * @param sourceLang Optional source language code (auto-detected if not provided)
   * @returns The translated text
   */
  async translate(
    text: string,
    targetLang: LanguageCode,
    sourceLang?: LanguageCode
  ): Promise<string> {
    const response = await this.client.post<ApiResponse<TranslationResult>>(
      this.endpoint('/translate'),
      {
        text,
        target_lang: targetLang,
        ...(sourceLang && { source_lang: sourceLang }),
      }
    );
    return response.result.translation;
  }

  /**
   * Analyze the sentiment of the provided text
   * @param text The text to analyze
   * @returns Sentiment analysis result with confidence score
   */
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    const response = await this.client.post<ApiResponse<SentimentResult>>(
      this.endpoint('/sentiment'),
      { text }
    );
    return response.result;
  }
}
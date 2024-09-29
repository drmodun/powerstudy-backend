import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GENERATION_CONFIG, MODELS, SAFETY_SETTINGS } from './gemini.config';
import { env } from 'process';

export const GeminiFlashModuleProvider: Provider<GenerativeModel> = {
  provide: MODELS.FLASH_MODEL,
  useFactory: () => {
    if (!env.GEMINI_API_KEY) throw new Error('No valid key provided');
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({
      model: MODELS.FLASH_MODEL,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  },
};

export const GeminiProModuleProvider: Provider<GenerativeModel> = {
  provide: MODELS.PRO_MODEL,
  useFactory: () => {
    if (!env.GEMINI_API_KEY) throw new Error('No valid key provided');
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({
      model: MODELS.PRO_MODEL,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  },
};

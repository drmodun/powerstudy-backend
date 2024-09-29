import {
  Content,
  GenerationConfig,
  GenerativeModel,
  Part,
  ResponseSchema,
} from '@google/generative-ai';
import { Inject, Injectable } from '@nestjs/common';
import { MODELS } from './gemini.config';
import { GenAiResponse } from './dto/interfaces';
import { Express } from 'express';
import Multer from 'multer';
import {
  GoogleAIFileManager,
  UploadFileResponse,
} from '@google/generative-ai/dist/server/server';
import { env } from 'process';
import { FileInput } from '../../src/base/fileResults/fileResult.dto';

@Injectable()
export class GeminiService {
  constructor(
    @Inject(MODELS.FLASH_MODEL) private readonly flashModel: GenerativeModel,
    @Inject(MODELS.PRO_MODEL) private readonly proModel: GenerativeModel,
  ) {}

  async generateText(
    prompt: string,
    schema?: ResponseSchema,
  ): Promise<GenAiResponse> {
    const contents = this.createContent(prompt);

    const { totalTokens } = await this.flashModel.countTokens({ contents });

    const result = await this.flashModel.generateContent({
      contents,
      ...(schema && {
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
    });

    const response = await result.response;
    const text = response.text();

    return { totalTokens, text };
  }

  async generateTextPro(
    prompt: string,
    schema?: ResponseSchema,
  ): Promise<GenAiResponse> {
    const contents = this.createContent(prompt);

    const { totalTokens } = await this.proModel.countTokens({ contents });

    const result = await this.proModel.generateContent({
      contents,
      ...(schema && {
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
    });

    const response = await result.response;
    const text = response.text();

    return { totalTokens, text };
  }

  async visionGenerate(
    prompt: string,
    image: Express.Multer.File,
    schema?: ResponseSchema,
  ): Promise<GenAiResponse> {
    const contents = this.createContent(prompt, image);

    const { totalTokens } = await this.proModel.countTokens({ contents });

    const result = await this.proModel.generateContent({
      contents,
      ...(schema && {
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }), // TODO: refactor this to be more readable
    });

    const response = await result.response;
    const text = response.text();

    return { totalTokens, text };
  }

  async visionGenerateWithUploads(
    prompt: string,
    files: FileInput[],
    schema?: ResponseSchema,
  ): Promise<GenAiResponse> {
    const contents = this.createContentWithUploads(prompt, files);

    const { totalTokens } = await this.flashModel.countTokens({ contents });

    const result = await this.flashModel.generateContent({
      contents,
      ...(schema && {
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
    });
    const response = await result.response;
    const text = response.text();

    return { totalTokens, text };
  }

  createContentWithUploads(text: string, files: FileInput[]) {
    const fileData = files.map((uploadResult) => {
      return {
        fileData: {
          mimeType: uploadResult.mimeType,
          fileUri: uploadResult.fileUri,
        },
      };
    });

    return [
      {
        role: 'user',
        parts: [
          ...fileData,
          {
            text,
          },
        ],
      },
    ];
  }

  createContent(text: string, ...images: Express.Multer.File[]): Content[] {
    const imageParts: Part[] = images.map((image) => {
      return {
        inlineData: {
          mimeType: image.mimetype,
          data: image.buffer.toString('base64'),
        },
      };
    });

    return [
      {
        role: 'user',
        parts: [
          ...imageParts,
          {
            text,
          },
        ],
      },
    ];
  }
}

import { Content, GenerativeModel, Part } from '@google/generative-ai';
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
import { FileInput } from 'src/base/fileResults/fileResult.dto';

@Injectable()
export class GeminiService {
  constructor(
    @Inject(MODELS.FLASH_MODEL) private readonly flashModel: GenerativeModel,
  ) {}

  async generateText(prompt: string): Promise<GenAiResponse> {
    const contents = this.createContent(prompt);

    const { totalTokens } = await this.flashModel.countTokens({ contents });
    const result = await this.flashModel.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    return { totalTokens, text };
  }

  async visionGenerate(
    prompt: string,
    ...images: Express.Multer.File[]
  ): Promise<GenAiResponse> {
    const contents = this.createContent(prompt, ...images);

    const { totalTokens } = await this.flashModel.countTokens({ contents });
    const result = await this.flashModel.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    return { totalTokens, text };
  }

  async visionGenerateWithUploads(
    prompt: string,
    files: FileInput[],
  ): Promise<GenAiResponse> {
    const contents = this.createContentWithUploads(prompt, files);

    const { totalTokens } = await this.flashModel.countTokens({ contents });
    const result = await this.flashModel.generateContent({ contents });
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

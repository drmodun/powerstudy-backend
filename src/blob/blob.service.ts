import { GoogleAIFileManager } from '@google/generative-ai/server';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class BlobService {
  async uploadFiles(images: Express.Multer.File[]) {
    const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
    const promises = images.map((image) => {
      return fileManager.uploadFile(image.path, {
        mimeType: image.mimetype,
      });
    });

    return Promise.all(promises);
  }
}

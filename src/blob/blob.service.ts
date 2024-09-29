import {
  GoogleAIFileManager,
  UploadFileResponse,
} from '@google/generative-ai/server';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { env } from 'process';

@Injectable()
export class BlobService {
  constructor(private readonly httpService: HttpService) {}

  async uploadFiles(images: Express.Multer.File[]) {
    const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
    const promises = images.map((image) => {
      const formData = new FormData();
      const metadata = {
        file: { mimeType: image.mimetype },
      };

      formData.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
      );
      formData.append(
        'file',
        new Blob([image.buffer], { type: image.mimetype }),
      );

      return this.httpService.axiosRef.post<
        any,
        AxiosResponse<UploadFileResponse>
      >(
        `https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=multipart&key=${fileManager.apiKey}`,
        formData,
      );
    });

    return Promise.all(promises);
  }
}

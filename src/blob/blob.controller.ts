import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlobService } from './blob.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileResult } from 'src/base/fileResults/fileResult.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('blob')
export class BlobController {
  constructor(private readonly blobService: BlobService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/images')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: [FileResult] })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return (await this.blobService.uploadFiles(files)).map((result) => {
      return {
        fileUri: result.file.uri,
        mimeType: result.file.mimeType,
      };
    });
  }

  @Post('/audio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: [FileResult] })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadAudio(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'audio/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return (await this.blobService.uploadFiles(files)).map((result) => {
      return {
        fileUri: result.file.uri,
        mimeType: result.file.mimeType,
      };
    });
  }

  @Post('/video')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: [FileResult] })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadVideo(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'video/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return (await this.blobService.uploadFiles(files)).map((result) => {
      return {
        fileUri: result.file.uri,
        mimeType: result.file.mimeType,
      };
    });
  }
}

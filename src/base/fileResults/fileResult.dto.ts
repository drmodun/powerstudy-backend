import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsString } from 'class-validator';

export class FileResult {
  @ApiProperty()
  @IsString()
  fileUri: string;

  @ApiProperty()
  @IsMimeType()
  mimeType: string;
}

export class FileInput {
  @ApiProperty()
  @IsString()
  fileUri: string;

  @ApiProperty()
  @IsMimeType()
  mimeType: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}

export class GenerateNotesDto {
  @ApiProperty()
  @IsString()
  fileUri: string;

  @ApiProperty()
  @IsMimeType()
  mimeType: string;
}

export interface PromptOptions {
  title: string;
  subject: string;
  levelOfDetail: string;
  language: string;
  difficulty: string;
}

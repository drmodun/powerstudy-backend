import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMimeType, IsString } from 'class-validator';

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

export class FullGenerateNotesDto {
  @ApiProperty({ isArray: true, type: GenerateNotesDto })
  @IsArray()
  @Type(() => GenerateNotesDto)
  notes: GenerateNotesDto[];
}

export interface PromptOptions {
  title: string;
  subject: string;
  levelOfDetail: string;
  language: string;
  difficulty: string;
}

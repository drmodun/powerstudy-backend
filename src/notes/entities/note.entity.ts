import { ApiProperty, ApiResponse, ApiResponseProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class NoteResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiResponseProperty()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amountOfBookmarks?: number;
}

export class NoteResponseExtended extends NoteResponse {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  knowledgeBaseId: number;

  @ApiProperty()
  knowledgeBaseTitle: string;
}

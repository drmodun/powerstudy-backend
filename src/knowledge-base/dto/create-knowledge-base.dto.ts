import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { difficulty, levelOfDetail, subjects } from 'src/db/schema';

export type difficultyEnumType =
  | 'elementary'
  | 'middle'
  | 'high'
  | 'college'
  | 'unspecified';

export type levelOfDetailEnumType = 'low' | 'medium' | 'high';

export type subjectEnumType =
  | 'math'
  | 'science'
  | 'history'
  | 'language'
  | 'literature'
  | 'art'
  | 'biology'
  | 'chemistry';

export class CreateKnowledgeBaseDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsEnum(difficulty.enumValues)
  difficulty: difficultyEnumType;

  @ApiProperty()
  @IsEnum(levelOfDetail.enumValues)
  levelOfDetail: levelOfDetailEnumType;

  @ApiProperty()
  @IsEnum(subjects.enumValues)
  subject: subjectEnumType;
}

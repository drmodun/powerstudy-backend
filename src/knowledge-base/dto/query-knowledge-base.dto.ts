import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { difficulty, subjects } from 'src/db/schema';
import {
  difficultyEnumType,
  levelOfDetailEnumType,
  subjectEnumType,
} from './create-knowledge-base.dto';
import { BaseQuery } from 'src/base/query/BaseQuery';

export class KnowledgeBaseQuery extends BaseQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(difficulty.enumValues)
  difficulty?: difficultyEnumType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(subjects.enumValues)
  subject?: subjectEnumType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(difficulty.enumValues)
  levelOfDetail?: levelOfDetailEnumType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/base/query/BaseQuery';

export class QueryNoteDto extends BaseQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  knowledgeBaseId?: string;
}

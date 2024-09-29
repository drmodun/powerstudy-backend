import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateQuestionAnswerDto {
  @ApiProperty()
  @IsString()
  question: string;
}

export interface WolframInput {
  input: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class QuestionAnswerResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  updatedAt: Date;
}

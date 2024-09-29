import { ApiResponseProperty } from '@nestjs/swagger';

export class MathProblemResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  mathQuestion: string;

  @ApiResponseProperty()
  solution: string;

  @ApiResponseProperty()
  updatedAt: Date;
}

import { ApiResponseProperty } from '@nestjs/swagger';

export class KnowledgeBaseResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  difficulty: string;

  @ApiResponseProperty()
  levelOfDetail: string;

  @ApiResponseProperty()
  subject: string;
}

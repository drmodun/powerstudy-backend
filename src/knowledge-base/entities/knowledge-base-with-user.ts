import { ApiResponseProperty } from '@nestjs/swagger';
import { KnowledgeBaseResponse } from './knowledge-base.entity';
import { UserResponse } from 'src/users/entities/user.entity';
import { Type } from 'class-transformer';

export class KnowledgeBaseWithUser extends KnowledgeBaseResponse {
  @Type(() => UserResponse)
  @ApiResponseProperty()
  user: UserResponse;
}

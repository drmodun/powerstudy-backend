import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { KnowledgeBasesService } from 'src/knowledge-base/knowledge-base.service';

@Injectable()
export class KnowledgeBaseOwnerGuard implements CanActivate {
  constructor(private knowledgeBasesService: KnowledgeBasesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const knowledgeBaseId = Number(request.params.id);

    const isOwner = await this.knowledgeBasesService.checkBaseOwnership(
      knowledgeBaseId,
      user.id,
    );

    if (!isOwner)
      throw new UnauthorizedException(
        "You cannot edit a knowledge base that you don't own",
      );

    return true;
  }
}

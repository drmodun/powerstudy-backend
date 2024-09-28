import { Module } from '@nestjs/common';
import { KnowledgeBasesController } from './knowledge-base.controller';
import { KnowledgeBasesService } from './knowledge-base.service';

@Module({
  controllers: [KnowledgeBasesController],
  providers: [KnowledgeBasesService],
})
export class KnowledgeBaseModule {}

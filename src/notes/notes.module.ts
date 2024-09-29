import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { KnowledgeBaseModule } from 'src/knowledge-base/knowledge-base.module';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports: [KnowledgeBaseModule, GeminiModule],
})
export class NotesModule {}

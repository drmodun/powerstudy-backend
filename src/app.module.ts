import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { GeminiModule } from './gemini/gemini.module';
import { NotesModule } from './notes/notes.module';
import { BlobModule } from './blob/blob.module';
import { MathProblemsModule } from './math-problems/math-problems.module';
import { WolframModule } from './wolfram/wolfram.module';

@Module({
  imports: [UsersModule, AuthModule, KnowledgeBaseModule, GeminiModule, NotesModule, BlobModule, MathProblemsModule, WolframModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

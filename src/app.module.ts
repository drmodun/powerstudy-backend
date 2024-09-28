import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';

@Module({
  imports: [UsersModule, AuthModule, KnowledgeBaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

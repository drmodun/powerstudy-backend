import { Module } from '@nestjs/common';
import { QuestionAnswersService } from './question-answers.service';
import { QuestionAnswersController } from './question-answers.controller';
import { GeminiModule } from '../../src/gemini/gemini.module';
import { WolframModule } from '../../src/wolfram/wolfram.module';

@Module({
  controllers: [QuestionAnswersController],
  providers: [QuestionAnswersService],
  imports: [GeminiModule, WolframModule],
})
export class QuestionAnswersModule {}

import { Module } from '@nestjs/common';
import { QuestionAnswersService } from './question-answers.service';
import { QuestionAnswersController } from './question-answers.controller';

@Module({
  controllers: [QuestionAnswersController],
  providers: [QuestionAnswersService],
})
export class QuestionAnswersModule {}

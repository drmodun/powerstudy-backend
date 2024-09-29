import { Module } from '@nestjs/common';
import { MathProblemsService } from './math-problems.service';
import { MathProblemsController } from './math-problems.controller';
import { GeminiModule } from '../../src/gemini/gemini.module';
import { WolframModule } from '../../src/wolfram/wolfram.module';

@Module({
  controllers: [MathProblemsController],
  providers: [MathProblemsService],
  imports: [GeminiModule, WolframModule],
})
export class MathProblemsModule {}

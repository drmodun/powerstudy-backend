import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiFlashModuleProvider } from './gemini.provider';

@Module({
  providers: [GeminiService, GeminiFlashModuleProvider],
  exports: [GeminiService],
})
export class GeminiModule {}

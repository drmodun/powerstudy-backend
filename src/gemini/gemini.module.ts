import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import {
  GeminiFlashModuleProvider,
  GeminiProModuleProvider,
} from './gemini.provider';

@Module({
  providers: [
    GeminiService,
    GeminiFlashModuleProvider,
    GeminiProModuleProvider,
  ],
  exports: [GeminiService],
})
export class GeminiModule {}

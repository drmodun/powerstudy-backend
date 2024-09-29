import { Module } from '@nestjs/common';
import { WolframService } from './wolfram.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [WolframService],
  imports: [HttpModule],
  exports: [WolframService],
})
export class WolframModule {}

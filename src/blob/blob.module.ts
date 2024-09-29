import { Module } from '@nestjs/common';
import { BlobService } from './blob.service';
import { BlobController } from './blob.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [BlobController],
  providers: [BlobService],
  imports: [HttpModule],
})
export class BlobModule {}

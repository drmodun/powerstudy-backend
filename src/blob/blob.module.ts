import { Module } from '@nestjs/common';
import { BlobService } from './blob.service';
import { BlobController } from './blob.controller';

@Module({
  controllers: [BlobController],
  providers: [BlobService],
})
export class BlobModule {}

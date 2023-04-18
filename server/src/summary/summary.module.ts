import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({

  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}

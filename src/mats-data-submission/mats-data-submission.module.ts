import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsDataSubmissionController } from './mats-data-submission.controller';
import { MatsDataSubmissionService } from './mats-data-submission.service';

@Module({
  controllers: [MatsDataSubmissionController],
  providers: [MatsDataSubmissionService],
})
export class MatsDataSubmissionModule {}

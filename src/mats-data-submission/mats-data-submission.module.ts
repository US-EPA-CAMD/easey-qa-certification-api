import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsDataSubmissionController } from './mats-data-submission.controller';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatsDataSubmissionRepository])],
  controllers: [MatsDataSubmissionController],
  providers: [
    MatsDataSubmissionRepository,
    MatsDataSubmissionMap,
    MatsDataSubmissionService,
  ],
  exports: [
    TypeOrmModule,
    MatsDataSubmissionMap,
    MatsDataSubmissionRepository,
    MatsDataSubmissionService,
  ],
})
export class MatsDataSubmissionModule {}

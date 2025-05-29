import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionChecksService } from './mats-data-submission-checks.service';
import { MatsDataSubmissionController } from './mats-data-submission.controller';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsDataSubmissionRepository]),
    HttpModule,
  ],
  controllers: [MatsDataSubmissionController],
  providers: [
    MatsDataSubmissionChecksService,
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

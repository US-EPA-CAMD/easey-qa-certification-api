import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearitySummaryModule } from '../linearity-summary/linearity-summary.module';
import { TestSummaryController } from './test-summary.controller';
import { TestSummaryRepository } from './test-summary.repository';
import { TestSummaryService } from './test-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestSummaryRepository,
    ]),
    LinearitySummaryModule,
  ],
  controllers: [
    TestSummaryController
  ],
  providers: [
    TestSummaryService,
    TestSummaryMap
  ],
  exports: [
    TypeOrmModule,
    TestSummaryService,
    TestSummaryMap
  ],
})
export class TestSummaryModule {}

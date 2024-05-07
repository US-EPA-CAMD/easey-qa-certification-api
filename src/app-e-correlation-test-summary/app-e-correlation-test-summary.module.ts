import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppECorrelationTestRunModule } from '../app-e-correlation-test-run/app-e-correlation-test-run.module';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { AppendixETestSummaryController } from './app-e-correlation-test-summary.controller';
import { AppendixETestSummaryRepository } from './app-e-correlation-test-summary.repository';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppendixETestSummaryRepository]),
    forwardRef(() => AppECorrelationTestRunModule),
  ],
  controllers: [AppendixETestSummaryController],
  providers: [
    AppECorrelationTestSummaryMap,
    AppendixETestSummaryRepository,
    AppECorrelationTestSummaryService,
  ],
  exports: [
    TypeOrmModule,
    AppECorrelationTestSummaryMap,
    AppECorrelationTestSummaryService,
  ],
})
export class AppECorrelationTestSummaryModule {}

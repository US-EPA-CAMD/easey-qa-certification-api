import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppECorrelationTestSummaryMap } from 'src/maps/app-e-correlation-summary.map';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';
import { AppendixETestSummaryController } from './app-e-correlation-test-summary.controller';
import { TestSummaryModule } from 'src/test-summary/test-summary.module';
import { AppendixETestSummaryRepository } from './app-e-correlation-test-summary.repository';
import { AppECorrelationTestRunModule } from '../app-e-correlation-test-run/app-e-correlation-test-run.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppendixETestSummaryRepository]),
    AppECorrelationTestRunModule,
  ],
  controllers: [AppendixETestSummaryController],
  providers: [AppECorrelationTestSummaryMap, AppECorrelationTestSummaryService],
  exports: [
    TypeOrmModule,
    AppECorrelationTestSummaryMap,
    AppECorrelationTestSummaryService,
  ],
})
export class AppECorrelationTestSummaryModule {}

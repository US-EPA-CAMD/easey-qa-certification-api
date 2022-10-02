import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeCorrelationSummaryMap } from 'src/maps/app-e-correlation-summary.map';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';
import { AppendixETestSummaryController } from './app-e-correlation-test-summary.controller';
import { TestSummaryModule } from 'src/test-summary/test-summary.module';
import { AppendixETestSummaryRepository } from './app-e-correlation-test-summary.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppendixETestSummaryRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [AppendixETestSummaryController],
  providers: [AeCorrelationSummaryMap, AppECorrelationTestSummaryService],
  exports: [
    TypeOrmModule,
    AeCorrelationSummaryMap,
    AppECorrelationTestSummaryService,
  ],
})
export class AppECorrelationTestSummaryModule {}

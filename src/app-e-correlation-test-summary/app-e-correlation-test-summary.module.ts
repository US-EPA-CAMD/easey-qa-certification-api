import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeCorrelationSummaryMap } from 'src/maps/ae-correlation-summary.map';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';
import { AppendixETestSummaryController } from './app-e-correlation-test-summary.controller';
import { TestSummaryModule } from 'src/test-summary/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppECorrelationTestSummaryService]),
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
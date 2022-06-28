import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearitySummaryModule } from '../linearity-summary/linearity-summary.module';
import { LinearityInjectionModule } from '../linearity-injection/linearity-injection.module';

import { TestSummaryController } from './test-summary.controller';
import { TestSummaryRepository } from './test-summary.repository';
import { TestSummaryService } from './test-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestSummaryRepository]),
    LinearitySummaryModule,
    LinearityInjectionModule,
  ],
  controllers: [TestSummaryController],
  providers: [TestSummaryMap, TestSummaryService],
  exports: [TypeOrmModule, TestSummaryMap, TestSummaryService],
})
export class TestSummaryModule {}

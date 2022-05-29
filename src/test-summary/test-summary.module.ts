import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryController } from './test-summary.controller';
import { TestSummaryRepository } from './test-summary.repository';
import { TestSummaryService } from './test-summary.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    TestSummaryRepository,
  ])],
  controllers: [TestSummaryController],
  providers: [TestSummaryService],
})
export class TestSummaryModule {}

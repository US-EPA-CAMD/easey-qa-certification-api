import { Module } from '@nestjs/common';
import { CycleTimeSummaryService } from './cycle-time-summary.service';
import { CycleTimeSummaryController } from './cycle-time-summary.controller';
import { CycleTimeSummaryRepository } from './cycle-time-summary.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';

@Module({
  imports: [TypeOrmModule.forFeature([CycleTimeSummaryRepository])],
  controllers: [CycleTimeSummaryController],
  providers: [CycleTimeSummaryMap, CycleTimeSummaryService],
  exports: [TypeOrmModule, CycleTimeSummaryMap, CycleTimeSummaryService],
})
export class CycleTimeSummaryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CycleTimeSummaryService } from './cycle-time-summary.service';
import { CycleTimeSummaryController } from './cycle-time-summary.controller';
import { CycleTimeSummaryRepository } from './cycle-time-summary.repository';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { CycleTimeInjectionModule } from '../cycle-time-injection/cycle-time-injection.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CycleTimeSummaryRepository]),
    CycleTimeInjectionModule,
  ],
  controllers: [CycleTimeSummaryController],
  providers: [CycleTimeSummaryMap, CycleTimeSummaryService],
  exports: [TypeOrmModule, CycleTimeSummaryMap, CycleTimeSummaryService],
})
export class CycleTimeSummaryModule {}

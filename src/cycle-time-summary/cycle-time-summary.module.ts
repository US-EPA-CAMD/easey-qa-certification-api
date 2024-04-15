import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CycleTimeInjectionModule } from '../cycle-time-injection/cycle-time-injection.module';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { CycleTimeSummaryController } from './cycle-time-summary.controller';
import { CycleTimeSummaryRepository } from './cycle-time-summary.repository';
import { CycleTimeSummaryService } from './cycle-time-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CycleTimeSummaryRepository]),
    CycleTimeInjectionModule,
  ],
  controllers: [CycleTimeSummaryController],
  providers: [
    CycleTimeSummaryMap,
    CycleTimeSummaryRepository,
    CycleTimeSummaryService,
  ],
  exports: [TypeOrmModule, CycleTimeSummaryMap, CycleTimeSummaryService],
})
export class CycleTimeSummaryModule {}

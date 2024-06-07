import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlowRataRunModule } from '../flow-rata-run/flow-rata-run.module';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunRepository } from '../rata-run/rata-run.repository';
import { RataSummaryModule } from '../rata-summary/rata-summary.module';
import { RataRunController } from './rata-run.controller';
import { RataRunService } from './rata-run.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRunRepository]),
    forwardRef(() => RataSummaryModule),
    forwardRef(() => FlowRataRunModule),
  ],
  controllers: [RataRunController],
  providers: [RataRunRepository, RataRunService, RataRunMap],
  exports: [TypeOrmModule, RataRunRepository, RataRunMap, RataRunService],
})
export class RataRunModule {}

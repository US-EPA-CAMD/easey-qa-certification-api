import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { RataRunModule } from '../rata-run/rata-run.module';
import { RataTraverseModule } from '../rata-traverse/rata-traverse.module';
import { FlowRataRunController } from './flow-rata-run.controller';
import { FlowRataRunRepository } from './flow-rata-run.repository';
import { FlowRataRunService } from './flow-rata-run.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowRataRunRepository]),
    forwardRef(() => RataRunModule),
    RataTraverseModule,
  ],
  controllers: [FlowRataRunController],
  providers: [FlowRataRunRepository, FlowRataRunService, FlowRataRunMap],
  exports: [
    TypeOrmModule,
    FlowRataRunRepository,
    FlowRataRunMap,
    FlowRataRunService,
  ],
})
export class FlowRataRunModule {}

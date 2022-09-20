import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowRataRunRepository } from './flow-rata-run.repository';
import { RataRunModule } from '../rata-run/rata-run.module';
import { FlowRataRunController } from './flow-rata-run.controller';
import { FlowRataRunService } from './flow-rata-run.service';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { RataTraverseModule } from '../rata-traverse/rata-traverse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowRataRunRepository]),
    forwardRef(() => RataRunModule),
    RataTraverseModule,
  ],
  controllers: [FlowRataRunController],
  providers: [FlowRataRunService, FlowRataRunMap],
  exports: [TypeOrmModule, FlowRataRunMap, FlowRataRunService],
})
export class FlowRataRunModule {}

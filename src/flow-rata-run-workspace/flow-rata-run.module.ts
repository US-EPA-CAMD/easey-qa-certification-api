import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run.repository';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run.module';
import { FlowRataRunWorkspaceController } from './flow-rata-run.controller';
import { FlowRataRunWorkspaceService } from './flow-rata-run.service';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowRataRunWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataRunWorkspaceModule),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [FlowRataRunWorkspaceController],
  providers: [FlowRataRunWorkspaceService, FlowRataRunMap],
  exports: [TypeOrmModule, FlowRataRunMap, FlowRataRunWorkspaceService],
})
export class FlowRataRunWorkspaceModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { FlowRataRunWorkspaceController } from './flow-rata-run-workspace.controller';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';
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

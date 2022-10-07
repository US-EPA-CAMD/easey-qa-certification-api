import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { FlowRataRunWorkspaceController } from './flow-rata-run-workspace.controller';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataTraverseWorkspaceModule } from '../rata-traverse-workspace/rata-traverse-workspace.module';
import { FlowRataRunModule } from '../flow-rata-run/flow-rata-run.module';
import { FlowRataRunChecksService } from './flow-rata-run-checks.service';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowRataRunWorkspaceRepository]),
    forwardRef(() => FlowRataRunModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    forwardRef(() => RataRunWorkspaceModule),
    RataTraverseWorkspaceModule,
    HttpModule,
  ],
  controllers: [FlowRataRunWorkspaceController],
  providers: [
    FlowRataRunWorkspaceService,
    FlowRataRunMap,
    FlowRataRunChecksService,
  ],
  exports: [
    TypeOrmModule,
    FlowRataRunMap,
    FlowRataRunWorkspaceService,
    FlowRataRunChecksService,
  ],
})
export class FlowRataRunWorkspaceModule {}

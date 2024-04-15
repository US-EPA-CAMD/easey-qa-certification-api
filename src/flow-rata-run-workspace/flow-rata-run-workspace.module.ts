import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlowRataRunModule } from '../flow-rata-run/flow-rata-run.module';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataTraverseWorkspaceModule } from '../rata-traverse-workspace/rata-traverse-workspace.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FlowRataRunChecksService } from './flow-rata-run-checks.service';
import { FlowRataRunWorkspaceController } from './flow-rata-run-workspace.controller';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';

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
    FlowRataRunWorkspaceRepository,
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

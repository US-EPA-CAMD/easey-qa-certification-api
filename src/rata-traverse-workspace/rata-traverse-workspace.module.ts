import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataTraverseModule } from '../rata-traverse/rata-traverse.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataTraverseChecksService } from './rata-traverse-checks.service';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataTraverseWorkspaceRepository]),
    forwardRef(() => RataTraverseModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    forwardRef(() => FlowRataRunWorkspaceModule),
    HttpModule,
    MonitorSystemModule,
  ],
  controllers: [RataTraverseWorkspaceController],
  providers: [
    RataTraverseWorkspaceRepository,
    RataTraverseWorkspaceService,
    RataTraverseMap,
    RataTraverseChecksService,
  ],
  exports: [
    TypeOrmModule,
    RataTraverseWorkspaceRepository,
    RataTraverseMap,
    RataTraverseWorkspaceService,
    RataTraverseChecksService,
  ],
})
export class RataTraverseWorkspaceModule {}

import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunModule } from '../rata-run/rata-run.module';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataRunChecksService } from './rata-run-checks.service';
import { RataRunWorkspaceController } from './rata-run-workspace.controller';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { RataRunWorkspaceService } from './rata-run-workspace.service';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRunWorkspaceRepository]),
    forwardRef(() => RataRunModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    FlowRataRunWorkspaceModule,
    HttpModule,
    MonitorSystemModule,
  ],
  controllers: [RataRunWorkspaceController],
  providers: [
    RataRunWorkspaceRepository,
    RataRunWorkspaceService,
    RataRunMap,
    RataRunChecksService,
  ],
  exports: [
    TypeOrmModule,
    RataRunMap,
    RataRunWorkspaceRepository,
    RataRunWorkspaceService,
    RataRunChecksService,
  ],
})
export class RataRunWorkspaceModule {}

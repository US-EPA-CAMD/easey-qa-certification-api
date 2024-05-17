import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RataSummaryMap } from '../maps/rata-summary.map';
import { LocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { QAMonitorPlanWorkspaceModule } from '../qa-monitor-plan-workspace/qa-monitor-plan.module';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { RataSummaryModule } from '../rata-summary/rata-summary.module';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';
import { ReferenceMethodCodeModule } from '../reference-method-code/reference-method-code.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataSummaryChecksService } from './rata-summary-checks.service';
import { RataSummaryWorkspaceController } from './rata-summary-workspace.controller';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataSummaryWorkspaceRepository]),
    MonitorSystemWorkspaceModule,
    LocationWorkspaceModule,
    ReferenceMethodCodeModule,
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataWorkspaceModule),
    forwardRef(() => RataSummaryModule),
    QAMonitorPlanWorkspaceModule,
    RataRunWorkspaceModule,
    HttpModule,
  ],
  controllers: [RataSummaryWorkspaceController],
  providers: [
    RataSummaryChecksService,
    RataSummaryMap,
    RataSummaryWorkspaceRepository,
    RataSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    RataSummaryMap,
    RataSummaryWorkspaceRepository,
    RataSummaryWorkspaceService,
    RataSummaryChecksService,
  ],
})
export class RataSummaryWorkspaceModule {}

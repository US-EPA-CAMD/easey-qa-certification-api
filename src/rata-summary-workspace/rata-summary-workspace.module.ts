import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';
import { RataSummaryWorkspaceController } from './rata-summary-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';
import { RataSummaryChecksService } from './rata-summary-checks.service';
import { RataSummaryModule } from '../rata-summary/rata-summary.module';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { ReferenceMethodCodeRepository } from '../reference-method-code/reference-method-code.repository';
import { QAMonitorPlanWorkspaceRepository } from '../qa-monitor-plan-workspace/qa-monitor-plan.repository';
import { LocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RataSummaryWorkspaceRepository,
      ReferenceMethodCodeRepository,
      QAMonitorPlanWorkspaceRepository,
      LocationWorkspaceRepository,
      MonitorSystemWorkspaceRepository,
    ]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataWorkspaceModule),
    forwardRef(() => RataSummaryModule),
    RataRunWorkspaceModule,
    HttpModule,
  ],
  controllers: [RataSummaryWorkspaceController],
  providers: [
    RataSummaryMap,
    RataSummaryWorkspaceService,
    RataSummaryChecksService,
  ],
  exports: [
    TypeOrmModule,
    RataSummaryMap,
    RataSummaryWorkspaceService,
    RataSummaryChecksService,
  ],
})
export class RataSummaryWorkspaceModule {}

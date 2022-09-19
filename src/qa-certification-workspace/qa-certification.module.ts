import { Module } from '@nestjs/common';

import { LocationWorkspaceModule } from '../location-workspace/location.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

import { QACertificationWorkspaceController } from './qa-certification.controller';
import { QACertificationChecksService } from './qa-certification-checks.service';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { QASuppDataWorkspaceModule } from '../qa-monitor-plan-workspace/qa-monitor-plan.module';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run.module';

@Module({
  imports: [
    QASuppDataWorkspaceModule,
    LocationWorkspaceModule,
    TestSummaryWorkspaceModule,
    LinearitySummaryWorkspaceModule,
    LinearityInjectionWorkspaceModule,
    RataWorkspaceModule,
    RataSummaryWorkspaceModule,
    RataRunWorkspaceModule,
  ],
  controllers: [QACertificationWorkspaceController],
  providers: [QACertificationChecksService, QACertificationWorkspaceService],
  exports: [QACertificationChecksService, QACertificationWorkspaceService],
})
export class QACertificationWorkspaceModule {}

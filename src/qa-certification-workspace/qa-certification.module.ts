import { HttpModule } from '@nestjs/axios';
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
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataTraverseWorkspaceModule } from '../rata-traverse-workspace/rata-traverse-workspace.module';
import { TestQualificationWorkspaceModule } from '../test-qualification-workspace/test-qualification-workspace.module';
import { QaCertificationEventWorkspaceModule } from '../qa-certification-event-workspace/qa-certification-event-workspace.module';
import { TestExtensionExemptionsWorkspaceModule } from '../test-extension-exemptions-workspace/test-extension-exemptions-workspace.module';

@Module({
  imports: [
    HttpModule,
    QASuppDataWorkspaceModule,
    LocationWorkspaceModule,
    TestSummaryWorkspaceModule,
    QaCertificationEventWorkspaceModule,
    LinearitySummaryWorkspaceModule,
    LinearityInjectionWorkspaceModule,
    RataWorkspaceModule,
    RataSummaryWorkspaceModule,
    RataRunWorkspaceModule,
    FlowRataRunWorkspaceModule,
    RataTraverseWorkspaceModule,
    TestQualificationWorkspaceModule,
    TestExtensionExemptionsWorkspaceModule,
  ],
  controllers: [QACertificationWorkspaceController],
  providers: [QACertificationChecksService, QACertificationWorkspaceService],
  exports: [QACertificationChecksService, QACertificationWorkspaceService],
})
export class QACertificationWorkspaceModule {}

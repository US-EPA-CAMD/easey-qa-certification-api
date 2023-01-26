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
import { CertEventReviewAndSubmitRepository } from './cert-event-review-and-submit.repository';
import { CertEventReviewAndSubmitService } from './cert-event-review-and-submit.service';
import { CertEventReviewAndSubmitMap } from '../maps/cert-event-review-and-submit.map';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryReviewAndSubmitRepository } from './test-summary-review-and-submit.repository';
import { TestSummaryReviewAndSubmitService } from './test-summary-review-and-submit.service';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { TeeReviewAndSubmitRepository } from './tee-review-and-submit.repository copy';
import { TeeReviewAndSubmitService } from './tee-review-and-submit.service';
import { TeeReviewAndSubmitMap } from '../maps/tee-review-and-submit.map';
import { QaCertificationEventWorkspaceModule } from '../qa-certification-event-workspace/qa-certification-event-workspace.module';
import { TestExtensionExemptionsWorkspaceModule } from '../test-extension-exemptions-workspace/test-extension-exemptions-workspace.module';
import { CycleTimeInjectionWorkspaceModule } from '../cycle-time-injection-workspace/cycle-time-injection-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CertEventReviewAndSubmitRepository,
      TestSummaryReviewAndSubmitRepository,
      TeeReviewAndSubmitRepository,
    ]),
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
    CycleTimeInjectionWorkspaceModule,
  ],
  controllers: [QACertificationWorkspaceController],
  providers: [
    QACertificationChecksService,
    QACertificationWorkspaceService,
    CertEventReviewAndSubmitService,
    CertEventReviewAndSubmitMap,
    TestSummaryReviewAndSubmitService,
    ReviewAndSubmitTestSummaryMap,
    TeeReviewAndSubmitService,
    TeeReviewAndSubmitMap,
  ],
  exports: [QACertificationChecksService, QACertificationWorkspaceService],
})
export class QACertificationWorkspaceModule {}

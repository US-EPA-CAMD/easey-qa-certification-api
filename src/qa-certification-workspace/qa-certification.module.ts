import { Module } from '@nestjs/common';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';

import { QACertificationWorkspaceController } from './qa-certification.controller';
import { QACertificationWorkspaceService } from './qa-certification.service';

@Module({
  imports: [
    TestSummaryWorkspaceModule,
    LinearitySummaryWorkspaceModule,
    LinearityInjectionWorkspaceModule,
  ],
  controllers: [
    QACertificationWorkspaceController
  ],
  providers: [
    QACertificationWorkspaceService,
  ],
})
export class QACertificationWorkspaceModule {}

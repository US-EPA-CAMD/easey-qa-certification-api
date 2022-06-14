import { Module } from '@nestjs/common';

import { ImportChecksModule } from './../import-checks/import-checks.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

import { QACertificationWorkspaceController } from './qa-certification.controller';
import { QACertificationWorkspaceService } from './qa-certification.service';

@Module({
  imports: [
    ImportChecksModule,
    TestSummaryWorkspaceModule,
  ],
  controllers: [
    QACertificationWorkspaceController
  ],
  providers: [
    QACertificationWorkspaceService,
  ],
})
export class QACertificationWorkspaceModule {}

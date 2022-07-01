import { Module } from '@nestjs/common';

import { LocationWorkspaceModule } from '../location-workspace/location.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

import { QACertificationWorkspaceController } from './qa-certification.controller';
import { QACertificationChecksService } from './qa-certification-checks.service';
import { QACertificationWorkspaceService } from './qa-certification.service';

@Module({
  imports: [LocationWorkspaceModule, TestSummaryWorkspaceModule],
  controllers: [QACertificationWorkspaceController],
  providers: [QACertificationChecksService, QACertificationWorkspaceService],
  exports: [QACertificationChecksService, QACertificationWorkspaceService],
})
export class QACertificationWorkspaceModule {}

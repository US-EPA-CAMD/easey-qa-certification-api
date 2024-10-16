import { Module } from '@nestjs/common';
import { TestExtensionExemptionsModule } from '../test-extension-exemptions/test-extension-exemptions.module';
import { QaCertificationEventModule } from '../qa-certification-event/qa-certification-event.module';

import { TestSummaryModule } from '../test-summary/test-summary.module';

import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';
import { QACertificationWorkspaceModule } from '../qa-certification-workspace/qa-certification.module';
import { EaseyContentModule } from '../qa-certification-easey-content/easey-content.module';

@Module({
  imports: [
    TestSummaryModule,
    QaCertificationEventModule,
    TestExtensionExemptionsModule,
    QACertificationWorkspaceModule,
    EaseyContentModule,
  ],
  controllers: [QACertificationController],
  providers: [QACertificationService],
})
export class QACertificationModule {}

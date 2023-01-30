import { Module } from '@nestjs/common';
import { TestExtensionExemptionsModule } from '../test-extension-exemptions/test-extension-exemptions.module';
import { QaCertificationEventModule } from '../qa-certification-event/qa-certification-event.module';

import { TestSummaryModule } from '../test-summary/test-summary.module';

import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';

@Module({
  imports: [
    TestSummaryModule,
    QaCertificationEventModule,
    TestExtensionExemptionsModule,
  ],
  controllers: [QACertificationController],
  providers: [QACertificationService],
})
export class QACertificationModule {}

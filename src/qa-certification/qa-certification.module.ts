import { Module } from '@nestjs/common';
import { QaCertificationEventModule } from 'src/qa-certification-event/qa-certification-event.module';

import { TestSummaryModule } from '../test-summary/test-summary.module';

import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';

@Module({
  imports: [TestSummaryModule, QaCertificationEventModule],
  controllers: [QACertificationController],
  providers: [QACertificationService],
})
export class QACertificationModule {}

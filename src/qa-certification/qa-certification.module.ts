import { Module } from '@nestjs/common';

import { TestSummaryModule } from '../test-summary/test-summary.module';

import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';

@Module({
  imports: [
    TestSummaryModule,
  ],
  controllers: [
    QACertificationController
  ],
  providers: [
    QACertificationService,
  ],
})
export class QACertificationModule {}

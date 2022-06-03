import { Module } from '@nestjs/common';

import { TestSummaryModule } from '../test-summary/test-summary.module';
import { LinearitySummaryModule } from '../linearity-summary/linearity-summary.module';
import { LinearityInjectionModule } from '../linearity-injection/linearity-injection.module';

import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';

@Module({
  imports: [
    TestSummaryModule,
    LinearitySummaryModule,
    LinearityInjectionModule,
  ],
  controllers: [
    QACertificationController
  ],
  providers: [
    QACertificationService,
  ],
})
export class QACertificationModule {}

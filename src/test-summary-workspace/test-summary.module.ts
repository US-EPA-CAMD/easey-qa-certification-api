import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';

import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QASuppDataWorkspaceRepository,
      TestSummaryWorkspaceRepository,
    ]),
    forwardRef(() => LinearitySummaryWorkspaceModule),
    forwardRef(() => LinearityInjectionWorkspaceModule),
  ],
  controllers: [
    TestSummaryWorkspaceController
  ],
  providers: [
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceService,
  ],
})
export class TestSummaryWorkspaceModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';

import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    TestSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    TestSummaryMap,
    TestSummaryWorkspaceService,
  ],
})
export class TestSummaryWorkspaceModule {}

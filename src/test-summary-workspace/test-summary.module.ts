import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestSummaryWorkspaceRepository,
    ]),
    LinearitySummaryWorkspaceModule,
  ],
  controllers: [
    TestSummaryWorkspaceController
  ],
  providers: [
    TestSummaryWorkspaceService,
    TestSummaryMap
  ],
  exports: [
    TypeOrmModule,
    TestSummaryWorkspaceService,
    TestSummaryMap
  ],
})
export class TestSummaryWorkspaceModule {}

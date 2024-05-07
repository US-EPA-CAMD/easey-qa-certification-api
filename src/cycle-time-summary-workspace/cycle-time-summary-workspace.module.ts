import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CycleTimeInjectionWorkspaceModule } from '../cycle-time-injection-workspace/cycle-time-injection-workspace.module';
import { CycleTimeSummaryModule } from '../cycle-time-summary/cycle-time-summary.module';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { CycleTimeSummaryWorkspaceController } from './cycle-time-summary-workspace.controller';
import { CycleTimeSummaryWorkspaceRepository } from './cycle-time-summary-workspace.repository';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CycleTimeSummaryWorkspaceRepository]),
    forwardRef(() => CycleTimeSummaryModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => CycleTimeInjectionWorkspaceModule),
    HttpModule,
  ],
  controllers: [CycleTimeSummaryWorkspaceController],
  providers: [
    CycleTimeSummaryMap,
    CycleTimeSummaryWorkspaceRepository,
    CycleTimeSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    CycleTimeSummaryMap,
    CycleTimeSummaryWorkspaceService,
  ],
})
export class CycleTimeSummaryWorkspaceModule {}

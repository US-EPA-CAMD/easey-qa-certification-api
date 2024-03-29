import { forwardRef, Module } from '@nestjs/common';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';
import { CycleTimeSummaryWorkspaceController } from './cycle-time-summary-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CycleTimeSummaryWorkspaceRepository } from './cycle-time-summary-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { CycleTimeSummaryModule } from '../cycle-time-summary/cycle-time-summary.module';
import { CycleTimeInjectionWorkspaceModule } from '../cycle-time-injection-workspace/cycle-time-injection-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CycleTimeSummaryWorkspaceRepository]),
    forwardRef(() => CycleTimeSummaryModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => CycleTimeInjectionWorkspaceModule),
    HttpModule,
  ],
  controllers: [CycleTimeSummaryWorkspaceController],
  providers: [CycleTimeSummaryMap, CycleTimeSummaryWorkspaceService],
  exports: [
    TypeOrmModule,
    CycleTimeSummaryMap,
    CycleTimeSummaryWorkspaceService,
  ],
})
export class CycleTimeSummaryWorkspaceModule {}

import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CycleTimeInjectionModule } from '../cycle-time-injection/cycle-time-injection.module';
import { CycleTimeSummaryWorkspaceModule } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.module';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { CycleTimeInjectionChecksService } from './cycle-time-injection-workspace-checks.service';
import { CycleTimeInjectionWorkspaceController } from './cycle-time-injection-workspace.controller';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CycleTimeInjectionWorkspaceRepository]),
    forwardRef(() => CycleTimeInjectionModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => CycleTimeSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [CycleTimeInjectionWorkspaceController],
  providers: [
    CycleTimeInjectionWorkspaceRepository,
    CycleTimeInjectionWorkspaceService,
    CycleTimeInjectionMap,
    CycleTimeInjectionChecksService,
  ],
  exports: [
    TypeOrmModule,
    CycleTimeInjectionMap,
    CycleTimeInjectionWorkspaceRepository,
    CycleTimeInjectionWorkspaceService,
    CycleTimeInjectionChecksService,
  ],
})
export class CycleTimeInjectionWorkspaceModule {}

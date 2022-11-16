import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';
import { CycleTimeInjectionWorkspaceController } from './cycle-time-injection-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { CycleTimeSummaryWorkspaceModule } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.module';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([CycleTimeInjectionWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => CycleTimeSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [CycleTimeInjectionWorkspaceController],
  providers: [CycleTimeInjectionWorkspaceService, CycleTimeInjectionMap],
  exports: [
    TypeOrmModule,
    CycleTimeInjectionMap,
    CycleTimeInjectionWorkspaceService,
  ],
})
export class CycleTimeInjectionWorkspaceModule {}

import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RataMap } from '../maps/rata.map';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { RataFrequencyCodeModule } from '../rata-frequency-code/rata-frequency-code.module';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataModule } from '../rata/rata.module';
import { TestResultCodeModule } from '../test-result-code/test-result-code.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataChecksService } from './rata-checks.service';
import { RataWorkspaceController } from './rata-workspace.controller';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataWorkspaceService } from './rata-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataWorkspaceRepository]),
    HttpModule,
    MonitorSystemModule,
    RataFrequencyCodeModule,
    forwardRef(() => RataModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    TestResultCodeModule,
  ],
  controllers: [RataWorkspaceController],
  providers: [
    RataWorkspaceRepository,
    RataMap,
    RataChecksService,
    RataWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    RataMap,
    RataWorkspaceRepository,
    RataChecksService,
    RataWorkspaceService,
  ],
})
export class RataWorkspaceModule {}

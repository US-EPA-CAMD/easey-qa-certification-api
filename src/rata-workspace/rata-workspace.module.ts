import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RataMap } from '../maps/rata.map';
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
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    forwardRef(() => RataModule),
    RataFrequencyCodeModule,
    TestResultCodeModule,
    HttpModule,
  ],
  controllers: [RataWorkspaceController],
  providers: [
    RataMap,
    RataWorkspaceRepository,
    RataChecksService,
    RataWorkspaceService,
  ],
  exports: [TypeOrmModule, RataMap, RataChecksService, RataWorkspaceService],
})
export class RataWorkspaceModule {}

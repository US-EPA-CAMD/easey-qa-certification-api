import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataRunWorkspaceController } from './rata-run-workspace.controller';
import { RataRunWorkspaceService } from './rata-run-workspace.service';
import { RataRunMap } from '../maps/rata-run.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataRunModule } from '../rata-run/rata-run.module';
import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataRunChecksService } from './rata-run-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRunWorkspaceRepository]),
    forwardRef(() => RataRunModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    FlowRataRunWorkspaceModule,
  ],
  controllers: [RataRunWorkspaceController],
  providers: [RataRunWorkspaceService, RataRunMap, RataRunChecksService],
  exports: [
    TypeOrmModule,
    RataRunMap,
    RataRunWorkspaceService,
    RataRunChecksService,
  ],
})
export class RataRunWorkspaceModule {}

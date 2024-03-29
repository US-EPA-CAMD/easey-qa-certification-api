import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseModule } from '../rata-traverse/rata-traverse.module';
import { RataTraverseChecksService } from './rata-traverse-checks.service';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataTraverseWorkspaceRepository]),
    forwardRef(() => RataTraverseModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    forwardRef(() => FlowRataRunWorkspaceModule),
    HttpModule,
  ],
  controllers: [RataTraverseWorkspaceController],
  providers: [
    RataTraverseWorkspaceService,
    RataTraverseMap,
    RataTraverseChecksService,
  ],
  exports: [
    TypeOrmModule,
    RataTraverseMap,
    RataTraverseWorkspaceService,
    RataTraverseChecksService,
  ],
})
export class RataTraverseWorkspaceModule {}

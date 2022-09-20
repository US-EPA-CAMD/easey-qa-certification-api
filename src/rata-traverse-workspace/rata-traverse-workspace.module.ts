import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';
import { RataTraverseWorkpsaceRepository } from './rata-traverse-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataTraverseWorkpsaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => FlowRataRunWorkspaceModule),
  ],
  controllers: [RataTraverseWorkspaceController],
  providers: [RataTraverseWorkspaceService, RataTraverseMap],
  exports: [TypeOrmModule, RataTraverseMap, RataTraverseWorkspaceService],
})
export class RataTraverseWorkspaceModule {}

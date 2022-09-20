import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';
import { RataTraverseWorkpsaceRepository } from './rata-traverse-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataTraverseWorkpsaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataWorkspaceModule),
  ],
  controllers: [RataTraverseWorkspaceController],
  providers: [RataTraverseWorkspaceService, RataTraverseMap],
  exports: [TypeOrmModule, RataTraverseMap, RataTraverseWorkspaceService],
})
export class RataTraverseWorkspaceModule {}

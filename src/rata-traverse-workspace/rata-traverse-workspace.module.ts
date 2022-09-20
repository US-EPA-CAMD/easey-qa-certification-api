import { Module } from '@nestjs/common';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';

@Module({
  controllers: [RataTraverseWorkspaceController],
  providers: [RataTraverseWorkspaceService]
})
export class RataTraverseWorkspaceModule {}

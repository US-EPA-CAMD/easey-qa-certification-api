import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSystemWorkspaceRepository } from './monitor-system-workspace.repository';
import { MonitorSystemWorkspaceService } from './monitor-system-workspace.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSystemWorkspaceRepository])],
  providers: [MonitorSystemWorkspaceRepository, MonitorSystemWorkspaceService],
  exports: [TypeOrmModule, MonitorSystemWorkspaceService],
})
export class MonitorSystemWorkspaceModule {}

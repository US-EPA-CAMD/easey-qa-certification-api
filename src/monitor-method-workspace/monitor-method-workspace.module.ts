import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorMethodWorkspaceRepository } from './monitor-method-workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorMethodWorkspaceRepository])],
  controllers: [],
  providers: [MonitorMethodWorkspaceRepository],
  exports: [TypeOrmModule, MonitorMethodWorkspaceRepository],
})
export class MonitorMethodWorkspaceModule {}

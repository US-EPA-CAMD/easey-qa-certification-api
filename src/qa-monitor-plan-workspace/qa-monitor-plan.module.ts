import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QAMonitorPlanWorkspaceRepository } from './qa-monitor-plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QAMonitorPlanWorkspaceRepository])],
  controllers: [],
  providers: [QAMonitorPlanWorkspaceRepository],
  exports: [TypeOrmModule],
})
export class QAMonitorPlanWorkspaceModule {}

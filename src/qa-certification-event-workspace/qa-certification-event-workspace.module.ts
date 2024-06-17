import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentModule } from '../component-workspace/component.module';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';
import { QACertificationEventWorkspaceController } from './qa-certification-event-workspace.controller';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import { QaCertificationEventModule } from '../qa-certification-event/qa-certification-event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QACertificationEventWorkspaceRepository]),
    QaCertificationEventModule,
    HttpModule,
    MonitorLocationModule,
    ComponentModule,
    MonitorSystemWorkspaceModule,
  ],
  controllers: [QACertificationEventWorkspaceController],
  providers: [
    ComponentWorkspaceRepository,
    MonitorLocationRepository,
    MonitorSystemWorkspaceRepository,
    QACertificationEventWorkspaceRepository,
    QACertificationEventRepository,
    QACertificationEventWorkspaceService,
    QACertificationEventMap,
    QACertificationEventChecksService,
  ],
  exports: [
    TypeOrmModule,
    QACertificationEventWorkspaceRepository,
    QACertificationEventMap,
    QACertificationEventWorkspaceService,
    QACertificationEventChecksService,
  ],
})
export class QaCertificationEventWorkspaceModule {}

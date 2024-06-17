import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';
import { QACertificationEventWorkspaceController } from './qa-certification-event-workspace.controller';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import { QACertificationEventRepository } from '../qa-certification-event/qa-certification-event.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QACertificationEventWorkspaceRepository,
      QACertificationEventRepository,
      MonitorLocationRepository,
      ComponentWorkspaceRepository,
      MonitorSystemWorkspaceRepository,
    ]),
    HttpModule,
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
    QACertificationEventMap,
    QACertificationEventWorkspaceService,
    QACertificationEventChecksService,
  ],
})
export class QaCertificationEventWorkspaceModule {}

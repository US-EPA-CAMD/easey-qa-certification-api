import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import { QACertificationEventWorkspaceController } from './qa-certification-event-workspace.controller';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QACertificationEventWorkspaceRepository,
      MonitorLocationRepository,
      ComponentWorkspaceRepository,
      MonitorSystemWorkspaceRepository,
    ]),
    HttpModule,
  ],
  controllers: [QACertificationEventWorkspaceController],
  providers: [
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

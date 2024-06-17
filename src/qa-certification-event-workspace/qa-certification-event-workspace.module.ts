import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { ComponentModule } from '../component-workspace/component.module';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';
import { QACertificationEventWorkspaceController } from './qa-certification-event-workspace.controller';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import { QACertificationEventRepository } from '../qa-certification-event/qa-certification-event.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QACertificationEventWorkspaceRepository]),
    QACertificationEventRepository,
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

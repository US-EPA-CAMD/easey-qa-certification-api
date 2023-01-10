import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QaCertificationEventWorkshopService } from './qa-certification-event-workshop.service';
import { QaCertificationEventWorkshopController } from './qa-certification-event-workshop.controller';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workshop.repository';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QACertificationEventWorkspaceRepository,
      MonitorLocationRepository,
    ]),
  ],
  controllers: [QaCertificationEventWorkshopController],
  providers: [QaCertificationEventWorkshopService, QACertificationEventMap],
  exports: [
    TypeOrmModule,
    QACertificationEventMap,
    QaCertificationEventWorkshopService,
  ],
})
export class QaCertificationEventWorkshopModule {}

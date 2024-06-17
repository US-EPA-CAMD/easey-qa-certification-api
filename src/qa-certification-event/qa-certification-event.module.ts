import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QaCertificationEventController } from './qa-certification-event.controller';
import { QACertificationEventRepository } from './qa-certification-event.repository';
import { QaCertificationEventService } from './qa-certification-event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QACertificationEventRepository]),
    HttpModule,
  ],
  controllers: [QaCertificationEventController],
  providers: [
    QACertificationEventRepository,
    QaCertificationEventService,
    QACertificationEventMap,
  ],
  exports: [
    TypeOrmModule,
    QACertificationEventRepository,
    QaCertificationEventService,
    QACertificationEventMap,
  ],
})
export class QaCertificationEventModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { QaCertificationEventService } from './qa-certification-event.service';
import { QaCertificationEventController } from './qa-certification-event.controller';
import { QACertificationEventRepository } from './qa-certification-event.repository';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([QACertificationEventRepository]),
    HttpModule,
  ],
  controllers: [QaCertificationEventController],
  providers: [QaCertificationEventService, QACertificationEventMap],
  exports: [
    TypeOrmModule,
    QaCertificationEventService,
    QACertificationEventMap,
  ],
})
export class QaCertificationEventModule {}

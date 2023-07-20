import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QACertificationEventRepository } from './qa-certification-event.repository';
import {
  QACertificationEventDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';

@Injectable()
export class QaCertificationEventService {
  constructor(
    private readonly map: QACertificationEventMap,
    @InjectRepository(QACertificationEventRepository)
    private readonly repository: QACertificationEventRepository,
  ) {}

  async getQACertEvent(id: string): Promise<QACertificationEventRecordDTO> {
    const result = await this.repository.getQACertificationEventById(id);

    if (!result) {
      throw new EaseyException(
        new Error(
          `A QA Certification Event record not found with Record Id [${id}]`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getQACertEventsByLocationId(
    locationId: string,
  ): Promise<QACertificationEventRecordDTO[]> {
    const results = await this.repository.getQACertificationEventsByLocationId(
      locationId,
    );

    return this.map.many(results);
  }

  async getQACertEvents(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertificationEventIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<QACertificationEventDTO[]> {
    const results = await this.repository.getQaCertEventsByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      qaCertificationEventIds,
      beginDate,
      endDate,
    );

    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertificationEventIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<QACertificationEventDTO[]> {
    const testSummaries = await this.getQACertEvents(
      facilityId,
      unitIds,
      stackPipeIds,
      qaCertificationEventIds,
      beginDate,
      endDate,
    );

    return testSummaries;
  }
}

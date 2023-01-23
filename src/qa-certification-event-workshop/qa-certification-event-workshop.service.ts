import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '../utilities/functions';

import { Unit } from '../entities/workspace/unit.entity';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';

import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workshop.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';

import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
  QACertificationEventImportDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';

@Injectable()
export class QaCertificationEventWorkshopService {
  constructor(
    private readonly logger: Logger,
    private readonly map: QACertificationEventMap,
    @InjectRepository(QACertificationEventWorkspaceRepository)
    private readonly repository: QACertificationEventWorkspaceRepository,
    @InjectRepository(MonitorLocationRepository)
    private readonly monitorLocationRepository: MonitorLocationRepository,
    @InjectRepository(UnitRepository)
    private readonly unitRepository: UnitRepository,
    @InjectRepository(StackPipeRepository)
    private readonly stackPipeRepository: StackPipeRepository,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentRepository: ComponentWorkspaceRepository,
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly monitoringSystemRepository: MonitorSystemWorkspaceRepository,
  ) {}

  async createQACertEvent(
    locationId: string,
    payload: QACertificationEventBaseDTO,
    userId: string,
  ): Promise<QACertificationEventRecordDTO> {
    const timestamp = currentDateTime();

    const {
      componentRecordId,
      monitoringSystemRecordId,
    } = await this.lookupValues(locationId, payload);

    const location = await this.monitorLocationRepository.findOne(locationId);

    let unit: Unit;
    let stackPipe: StackPipe;

    if (location.unitId) {
      unit = await this.unitRepository.findOne(location.unitId);
    } else if (location.stackPipeId) {
      stackPipe = await this.stackPipeRepository.findOne(location.stackPipeId);
    }

    if (
      (unit && payload.unitId !== unit.name) ||
      (stackPipe && payload.stackPipeId !== stackPipe.name)
    ) {
      throw new LoggingException(
        `The provided Location Id [${locationId}] does not match the provided Unit/Stack [${
          payload.unitId ? payload.unitId : payload.stackPipeId
        }]`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const entity = this.repository.create({
      ...payload,
      componentRecordId,
      monitoringSystemRecordId,
      id: uuid(),
      locationId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
      lastUpdated: timestamp,
      updatedStatusFlag: 'Y',
      needsEvalFlag: 'Y',
      evalStatusCode: 'EVAL',
      pendingStatusCode: 'PENDING',
    });

    await this.repository.save(entity);

    const result = await this.repository.getQACertificationEventById(entity.id);

    return this.map.one(result);
  }

  async getQACertEvent(id: string): Promise<QACertificationEventRecordDTO> {
    const result = await this.repository.getQACertificationEventById(id);

    if (!result) {
      throw new LoggingException(
        `A QA Certification Event record not found with Record Id [${id}]`,
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

  async lookupValues(locationId: string, payload: QACertificationEventBaseDTO) {
    let componentRecordId = null;
    let monitoringSystemRecordId = null;

    if (payload.componentID) {
      const component = await this.componentRepository.findOne({
        locationId: locationId,
        componentID: payload.componentID,
      });

      componentRecordId = component ? component.id : null;
    }

    if (payload.monitoringSystemID) {
      const monitorSystem = await this.monitoringSystemRepository.findOne({
        locationId,
        monitoringSystemID: payload.monitoringSystemID,
      });

      monitoringSystemRecordId = monitorSystem ? monitorSystem.id : null;
    }

    return {
      componentRecordId,
      monitoringSystemRecordId,
    };
  }

  async deleteQACertEvent(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException(
        `Error deleting QA Certification Event record Id [${id}]`,
        e.message,
      );
    }
  }

  async getQACertEvents(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertificationEventIds?: string[],
  ): Promise<QACertificationEventDTO[]> {
    const results = await this.repository.getQaCertEventsByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      qaCertificationEventIds,
    );

    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertificationEventIds?: string[],
  ): Promise<QACertificationEventDTO[]> {
    const qaCertEvents = await this.getQACertEvents(
      facilityId,
      unitIds,
      stackPipeIds,
      qaCertificationEventIds,
    );

    return qaCertEvents;
  }

  async import(
    locationId: string,
    payload: QACertificationEventImportDTO,
    userId: string,
  ) {
    const {
      componentRecordId,
      monitoringSystemRecordId,
    } = await this.lookupValues(locationId, payload);

    const record = await this.repository.findOne({
      where: {
        locationId,
        qaCertEventHour: payload.qaCertEventHour,
        qaCertEventDate: payload.qaCertEventDate,
        qaCertEventCode: payload.qaCertEventCode,
        componentRecordId,
        monitoringSystemRecordId,
      },
    });

    if (record) {
      // update
    }

    const createdQACertEvent = await this.createQACertEvent(
      locationId,
      payload,
      userId,
    );

    this.logger.info(
      `QA Certification Record Successfully Imported. Record Id: ${createdQACertEvent.id}`,
    );

    return null;
  }
}

import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

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
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';

@Injectable()
export class QaCertificationEventWorkshopService {
  constructor(
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
    historicalRecordId?: string,
  ): Promise<QACertificationEventRecordDTO> {
    const timestamp = currentDateTime();

    const { componentID, monitoringSystemID } = await this.lookupValues(
      locationId,
      payload,
    );

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
      componentID,
      monitoringSystemID,
      id: historicalRecordId || uuid(),
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

    const result = await this.repository.getQACertEventById(entity.id);

    return this.map.one(result);
  }

  async getQACertEvent(id: string): Promise<QACertificationEventRecordDTO> {
    const result = await this.repository.getQACertEventById(id);

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
    const results = await this.repository.getQACertEventsByLocationId(
      locationId,
    );

    return this.map.many(results);
  }

  async lookupValues(locationId: string, payload: QACertificationEventBaseDTO) {
    let componentID = null;
    let monitoringSystemID = null;

    if (payload.componentID) {
      const component = await this.componentRepository.findOne({
        locationId: locationId,
        componentID: payload.componentID,
      });

      componentID = component ? component.id : null;
    }

    if (payload.monitoringSystemID) {
      const monitorSystem = await this.monitoringSystemRepository.findOne({
        locationId,
        monitoringSystemID: payload.monitoringSystemID,
      });

      monitoringSystemID = monitorSystem ? monitorSystem.id : null;
    }

    return {
      componentID,
      monitoringSystemID,
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

  async updateQACertEvent(
    locationId: string,
    id: string,
    payload: QACertificationEventBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<QACertificationEventDTO> {
    const timestamp = currentDateTime();

    const entity = await this.getQACertEvent(id);

    const { componentID, monitoringSystemID } = await this.lookupValues(
      locationId,
      payload,
    );

    entity.componentID = componentID;
    entity.monitoringSystemID = monitoringSystemID;
    entity.qaCertEventCode = payload.qaCertEventCode;
    entity.qaCertEventDate = payload.qaCertEventDate;
    entity.qaCertEventHour = payload.qaCertEventHour;
    entity.requiredTestCode = payload.requiredTestCode;
    entity.requiredTestCode = payload.requiredTestCode;
    entity.conditionalBeginDate = payload.conditionalBeginDate;
    entity.conditionalBeginHour = payload.conditionalBeginHour;
    entity.completionTestDate = payload.completionTestDate;
    entity.completionTestHour = payload.completionTestHour;
    entity.userId = userId;
    entity.updateDate = timestamp.toLocaleString();

    await this.repository.save(entity);

    return this.getQACertEvent(entity.id);
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
}

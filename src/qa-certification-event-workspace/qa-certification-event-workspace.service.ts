import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { v4 as uuid } from 'uuid';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
  QACertificationEventImportDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';

@Injectable()
export class QACertificationEventWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: QACertificationEventMap,
    private readonly repository: QACertificationEventWorkspaceRepository,
    private readonly monitorLocationRepository: MonitorLocationRepository,
    private readonly componentRepository: ComponentWorkspaceRepository,
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

    const location = await this.monitorLocationRepository.getLocationByIdUnitIdStackPipeId(
      locationId,
      payload.unitId,
      payload.stackPipeId,
    );

    if (!location) {
      throw new EaseyException(
        new Error(
          `The provided Location Id [${locationId}] does not match the provided Unit/Stack [${
            payload.unitId ? payload.unitId : payload.stackPipeId
          }]`,
        ),
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
      submissionAvailabilityCode: 'REQUIRE',
    });

    await this.repository.save(entity);

    const result = await this.repository.getQACertificationEventById(entity.id);

    return this.map.one(result);
  }

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

  async lookupValues(locationId: string, payload: QACertificationEventBaseDTO) {
    let componentRecordId = null;
    let monitoringSystemRecordId = null;

    if (payload.componentId) {
      const component = await this.componentRepository.findOneBy({
        locationId: locationId,
        componentID: payload.componentId,
      });

      componentRecordId = component ? component.id : null;
    }

    if (payload.monitoringSystemId) {
      const monitorSystem = await this.monitoringSystemRepository.findOneBy({
        locationId,
        monitoringSystemID: payload.monitoringSystemId,
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

  async updateQACertEvent(
    locationId: string,
    id: string,
    payload: QACertificationEventBaseDTO,
    userId: string,
  ): Promise<QACertificationEventDTO> {
    const timestamp = currentDateTime();

    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `A QA Certification Event record not found with Record Id [${id}]`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    const {
      componentRecordId,
      monitoringSystemRecordId,
    } = await this.lookupValues(locationId, payload);

    entity.componentRecordId = componentRecordId;
    entity.monitoringSystemRecordId = monitoringSystemRecordId;
    entity.certificationEventCode = payload.certificationEventCode;
    entity.certificationEventDate = payload.certificationEventDate;
    entity.certificationEventHour = payload.certificationEventHour;
    entity.requiredTestCode = payload.requiredTestCode;
    entity.requiredTestCode = payload.requiredTestCode;
    entity.conditionalBeginDate = payload.conditionalBeginDate;
    entity.conditionalBeginHour = payload.conditionalBeginHour;
    entity.completionTestDate = payload.completionTestDate;
    entity.completionTestHour = payload.completionTestHour;
    entity.userId = userId;
    entity.updateDate = timestamp;
    entity.needsEvalFlag = 'Y';
    entity.updatedStatusFlag = 'Y';
    entity.evalStatusCode = 'EVAL';
    entity.submissionAvailabilityCode = 'REQUIRE';

    await this.repository.save(entity);

    return this.getQACertEvent(entity.id);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertificationEventIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<QACertificationEventDTO[]> {
    const qaCertEvents = await this.getQACertEvents(
      facilityId,
      unitIds,
      stackPipeIds,
      qaCertificationEventIds,
      beginDate,
      endDate,
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

    const record = await this.repository.findOneBy({
      locationId,
      certificationEventHour: payload.certificationEventHour,
      certificationEventDate: payload.certificationEventDate,
      certificationEventCode: payload.certificationEventCode,
      componentRecordId,
      monitoringSystemRecordId,
    });

    let importedQACertEvent;
    if (record) {
      importedQACertEvent = await this.updateQACertEvent(
        locationId,
        record.id,
        payload,
        userId,
      );
    } else {
      importedQACertEvent = await this.createQACertEvent(
        locationId,
        payload,
        userId,
      );
    }

    this.logger.log(
      `QA Certification Record Successfully Imported. Record Id: ${importedQACertEvent.id}`,
    );

    return null;
  }
}

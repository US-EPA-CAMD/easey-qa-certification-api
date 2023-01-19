import { HttpStatus, Injectable } from '@nestjs/common';
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
import {
  QACertificationEventBaseDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { Component } from '../entities/workspace/component.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';

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
  ): Promise<QACertificationEventRecordDTO> {
    const timestamp = currentDateTime().toLocaleString();

    const location = await this.monitorLocationRepository.findOne(locationId);

    let unit: Unit;
    let stackPipe: StackPipe;
    let component: Component;
    let system: MonitorSystem;

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

    if (payload.componentID) {
      component = await this.componentRepository.findOne({
        where: {
          componentTypeCode: payload.componentID,
        },
      });
    }

    if (payload.monitoringSystemID) {
      system = await this.monitoringSystemRepository.findOne({
        where: {
          monitoringSystemID: payload.monitoringSystemID,
        },
      });
    }

    const entity = this.repository.create({
      ...payload,
      componentID: component && component.id ? component.id : null,
      monitoringSystemID: system && system.id ? system.id : null,
      id: uuid(),
      locationId,
      updatedStatusFlag: 'Y',
      needsEvalFlag: 'Y',
      evalStatusCode: 'EVAL',
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);

    const result = await this.repository.findOne(entity.id);

    return await this.map.one(result);
  }

  async getQACertEvent(id: string): Promise<QACertificationEventRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `A QA Certification Event record not found with Record Id [${id}]`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

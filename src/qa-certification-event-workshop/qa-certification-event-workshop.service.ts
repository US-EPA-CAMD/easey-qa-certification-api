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
import {
  QACertificationEventBaseDTO,
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
  ) {}

  async createQACertEvent(
    locationId: string,
    payload: QACertificationEventBaseDTO,
    userId: string,
  ): Promise<QACertificationEventRecordDTO> {
    const timestamp = currentDateTime();

    const location = await this.monitorLocationRepository.findOne(locationId);

    let unit: Unit;
    let stackPipe: StackPipe;

    if (location.unitId) {
      unit = await this.unitRepository.findOne(location.unitId);
    } else {
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
}

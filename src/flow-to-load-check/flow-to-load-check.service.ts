import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import {
  FlowToLoadCheckDTO,
  FlowToLoadCheckRecordDTO,
} from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckRepository } from './flow-to-load-check.repository';

@Injectable()
export class FlowToLoadCheckService {
  constructor(
    private readonly map: FlowToLoadCheckMap,
    private readonly repository: FlowToLoadCheckRepository,
  ) {}

  async getFlowToLoadChecks(
    testSumId: string,
  ): Promise<FlowToLoadCheckRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFlowToLoadCheck(id: string): Promise<FlowToLoadCheckRecordDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Flow To Load Check record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getFlowToLoadChecksByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadCheckDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FlowToLoadCheckDTO[]> {
    return this.getFlowToLoadChecksByTestSumIds(testSumIds);
  }
}

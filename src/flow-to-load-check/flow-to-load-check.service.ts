import { HttpStatus, Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckRepository } from './flow-to-load-check.repository';
import {
  FlowToLoadCheckDTO,
  FlowToLoadCheckRecordDTO,
} from '../dto/flow-to-load-check.dto';
import { In } from 'typeorm';

@Injectable()
export class FlowToLoadCheckService {
  constructor(
    private readonly map: FlowToLoadCheckMap,
    @InjectRepository(FlowToLoadCheckRepository)
    private readonly repository: FlowToLoadCheckRepository,
  ) {}

  async getFlowToLoadChecks(
    testSumId: string,
  ): Promise<FlowToLoadCheckRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFlowToLoadCheck(id: string): Promise<FlowToLoadCheckRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Flow To Load Check record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getFlowToLoadChecksByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadCheckDTO[]> {
    const results = await this.repository.getFlowToLoadChecksByTestSumIds(
      testSumIds,
    );
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FlowToLoadCheckDTO[]> {
    return this.getFlowToLoadChecksByTestSumIds(testSumIds);
  }
}

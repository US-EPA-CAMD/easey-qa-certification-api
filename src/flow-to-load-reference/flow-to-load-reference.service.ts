import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { FlowToLoadReferenceRepository } from './flow-to-load-reference.repository';
import {
  FlowToLoadReferenceDTO,
  FlowToLoadReferenceRecordDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { In } from 'typeorm';

@Injectable()
export class FlowToLoadReferenceService {
  constructor(
    private readonly map: FlowToLoadReferenceMap,
    @InjectRepository(FlowToLoadReferenceRepository)
    private readonly repository: FlowToLoadReferenceRepository,
  ) {}

  async getFlowToLoadReferences(
    testSumId: string,
  ): Promise<FlowToLoadReferenceRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFlowToLoadReference(
    id: string,
  ): Promise<FlowToLoadReferenceRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new EaseyException(
        new Error(
          `Flow To Load Reference record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getFlowToLoadReferencesByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadReferenceDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FlowToLoadReferenceDTO[]> {
    return this.getFlowToLoadReferencesByTestSumIds(testSumIds);
  }
}

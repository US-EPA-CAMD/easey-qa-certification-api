import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { FlowToLoadReferenceRepository } from './flow-to-load-reference.repository';
import { FlowToLoadReferenceRecordDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';

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
      throw new LoggingException(
        `Flow To Load Reference record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

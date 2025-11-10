import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In, DataSource } from 'typeorm';

import {
  RataTraverseDTO,
  RataTraverseRecordDTO,
} from '../dto/rata-traverse.dto';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseRepository } from './rata-traverse.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class RataTraverseService {
  constructor(
    private readonly repository: RataTraverseRepository,
    private readonly map: RataTraverseMap,
    private readonly dataSource: DataSource,
  ) {}

  async getRataTraverses(
    flowRataRunId: string,
  ): Promise<RataTraverseRecordDTO[]> {
    const records = await useSlaveRepository(this.dataSource, RataTraverseRepository, async (repository) => repository.find({ where: { flowRataRunId } }));

    return this.map.many(records);
  }

  async getRataTraverse(id: string): Promise<RataTraverseRecordDTO> {
    const result = await useSlaveRepository(this.dataSource, RataTraverseRepository, async (repository) => repository.findOneBy({ id }));

    if (!result) {
      throw new EaseyException(
        new Error(`Rata Traverse record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getRatatravarsesByFlowRataRunIds(
    flowRataRunIds: string[],
  ): Promise<RataTraverseDTO[]> {
    const results = await this.repository.find({
      where: { flowRataRunId: In(flowRataRunIds) },
    });
    return this.map.many(results);
  }

  async export(flowRataRunIds: string[]): Promise<RataTraverseDTO[]> {
    return this.getRatatravarsesByFlowRataRunIds(flowRataRunIds);
  }
}

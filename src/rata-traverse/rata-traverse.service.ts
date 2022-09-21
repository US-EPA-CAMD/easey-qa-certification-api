import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataTraverseRecordDTO } from '../dto/rata-traverse.dto';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseRepository } from './rata-traverse.repository';

@Injectable()
export class RataTraverseService {
  constructor(
    @InjectRepository(RataTraverseRepository)
    private readonly repository: RataTraverseRepository,
    private readonly map: RataTraverseMap,
  ) {}

  async getRataTraverses(
    flowRataRunId: string,
  ): Promise<RataTraverseRecordDTO[]> {
    const records = await this.repository.find({ where: { flowRataRunId } });

    return this.map.many(records);
  }

  async getRataTraverse(id: string): Promise<RataTraverseRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Rata Traverse record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

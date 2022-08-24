import { HttpStatus, Injectable } from '@nestjs/common';
import { RataRunRepository } from './rata-run.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunDTO } from '../dto/rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class RataRunService {

  constructor(@InjectRepository(RataRunRepository)
              private readonly repository: RataRunRepository,
              private readonly map: RataRunMap
  ) {  }

  async getRataRuns(rataSummaryId: string): Promise<RataRunDTO[]> {
    const records = await this.repository.find(
      { where: {rataSummaryId } }
    );

    return this.map.many(records);
  }

  async getRataRun(id: string): Promise<RataRunDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Rata Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}
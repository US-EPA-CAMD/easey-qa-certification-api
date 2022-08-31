import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataDTO } from '../dto/rata.dto';
import { RataMap } from '../maps/rata.map';
import { RataRepository } from './rata.repository';

@Injectable()
export class RataService {
  constructor(
    private readonly map: RataMap,
    @InjectRepository(RataRepository)
    private readonly repository: RataRepository,
  ) {}

  async getRataById(id: string): Promise<RataDTO> {
    const result = await this.repository.findOne({
      id: id,
    });

    if (!result) {
      throw new LoggingException(
        `A RATA record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getRatasByTestSumId(testSumId: string): Promise<RataDTO[]> {
    const results = await this.repository.find({
      testSumId: testSumId,
    });
    return this.map.many(results);
  }
}

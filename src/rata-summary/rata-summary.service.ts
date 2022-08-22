import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataSummaryDTO } from '../dto/rata-summary.dto';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataSummaryRepository } from './rata-summary.repository';

@Injectable()
export class RataSummaryService {
  constructor(
    @InjectRepository(RataSummaryRepository)
    private readonly repository: RataSummaryRepository,
    private readonly map: RataSummaryMap,
  ) {}

  async getRataSummaries(rataId: string): Promise<RataSummaryDTO[]> {
    const records = await this.repository.find({
      rataId: rataId,
    });

    return this.map.many(records);
  }

  async getRataSummary(id: string): Promise<RataSummaryDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Rata Summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

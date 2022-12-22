import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { HgSummaryRepository } from './hg-summary.repository';

@Injectable()
export class HgSummaryService {
  constructor(
    private readonly map: HgSummaryMap,
    @InjectRepository(HgSummaryRepository)
    private readonly repository: HgSummaryRepository,
  ) {}

  async getHgSummaries(testSumId: string): Promise<HgSummaryDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getHgSummary(id: string, testSumId: string): Promise<HgSummaryDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Hg Summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

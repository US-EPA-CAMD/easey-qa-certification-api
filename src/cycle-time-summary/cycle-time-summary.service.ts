import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { CycleTimeSummaryRepository } from './cycle-time-summary.repository';

@Injectable()
export class CycleTimeSummaryService {
  constructor(
    private readonly map: CycleTimeSummaryMap,
    @InjectRepository(CycleTimeSummaryRepository)
    private readonly repository: CycleTimeSummaryRepository,
  ) {}

  async getCycleTimeSummarys(
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getCycleTimeSummary(
    id: string,
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Cycle Time Summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

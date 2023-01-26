import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { getManager, In } from 'typeorm';
import { TeeReviewAndSubmitRepository } from './tee-review-and-submit.repository copy';
import { TeeReviewAndSubmitMap } from '../maps/tee-review-and-submit.map';
import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';

@Injectable()
export class TeeReviewAndSubmitService {
  constructor(
    @InjectRepository(TeeReviewAndSubmitRepository)
    private readonly repository: TeeReviewAndSubmitRepository,
    private readonly map: TeeReviewAndSubmitMap,
  ) {}

  returnManager(): any {
    return getManager();
  }

  async getTeeRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
  ): Promise<TeeReviewAndSubmitDTO[]> {
    const filteredDates = [];

    let data;
    try {
      if (monPlanIds && monPlanIds.length > 0) {
        data = await this.map.many(
          await this.repository.find({ where: { monPlanId: In(monPlanIds) } }),
        );
      } else {
        data = await this.map.many(
          await this.repository.find({ where: { orisCode: In(orisCodes) } }),
        );
      }

      if (quarters && quarters.length > 0) {
        data = data.filter(f => quarters.includes(f.periodAbbreviation));
      }

      return data;
    } catch (e) {
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

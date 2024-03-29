import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { getManager, In } from 'typeorm';
import { TeeReviewAndSubmitRepository } from './tee-review-and-submit.repository';
import { TeeReviewAndSubmitMap } from '../maps/tee-review-and-submit.map';
import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';
import { TeeReviewAndSubmitGlobalRepository } from './tee-review-and-submit-global.repository';

@Injectable()
export class TeeReviewAndSubmitService {
  constructor(
    @InjectRepository(TeeReviewAndSubmitRepository)
    private readonly workspaceRepository: TeeReviewAndSubmitRepository,
    @InjectRepository(TeeReviewAndSubmitGlobalRepository)
    private readonly globalRepository: TeeReviewAndSubmitGlobalRepository,

    private readonly map: TeeReviewAndSubmitMap,
  ) {}

  returnManager(): any {
    return getManager();
  }

  async getTeeRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
  ): Promise<TeeReviewAndSubmitDTO[]> {
    const filteredDates = [];

    let repository;
    if (isWorkspace) {
      repository = this.workspaceRepository;
    } else {
      repository = this.globalRepository;
    }

    let data: TeeReviewAndSubmitDTO[];
    try {
      if (monPlanIds && monPlanIds.length > 0) {
        data = await this.map.many(
          await repository.find({ where: { monPlanId: In(monPlanIds) } }),
        );
      } else {
        data = await this.map.many(
          await repository.find({ where: { orisCode: In(orisCodes) } }),
        );
      }

      if (quarters && quarters.length > 0) {
        data = data.filter(f => quarters.includes(f.periodAbbreviation));
      }

      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

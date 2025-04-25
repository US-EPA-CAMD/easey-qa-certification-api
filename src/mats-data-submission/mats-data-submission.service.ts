import { Injectable } from '@nestjs/common';

import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';

@Injectable()
export class MatsDataSubmissionService {
  constructor(
    private readonly map: MatsDataSubmissionMap,
    private readonly repository: MatsDataSubmissionRepository,
  ) {}

  async getMatsDataSubmissions(
    monPlanId: string,
  ): Promise<MatsDataSubmissionDTO[]> {
    const result = await this.repository.getMatsDataSubmissions(monPlanId);

    return this.map.many(result);
  }
}

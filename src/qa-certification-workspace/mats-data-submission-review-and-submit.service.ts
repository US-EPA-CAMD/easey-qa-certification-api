import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from '../mats-data-submission/mats-data-submission.repository';

@Injectable()
export class MatsDataSubmissionReviewAndSubmitService {
  constructor(
    private readonly map: MatsDataSubmissionMap,
    private readonly repository: MatsDataSubmissionRepository,
  ) {}

  async getMatsDataSubmission(id: string): Promise<MatsDataSubmissionDTO> {
    const result = await this.repository.getMatsDataSubmission(id);

    return this.map.one(result);
  }

  async getMatsDataSubmissions(
    monPlanIds: string[],
  ): Promise<MatsDataSubmissionDTO[]> {
    if (!monPlanIds || monPlanIds.length === 0) {
      throw new EaseyException(
        new Error('At least one Monitor Plan ID must be provided'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.repository.getMatsDataSubmissions(monPlanIds);

    return this.map.many(result);
  }
}

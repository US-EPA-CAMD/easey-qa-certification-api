import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { In } from 'typeorm';
import { ReviewAndSubmitTestSummaryRepository } from './review-and-submit-test-summary.repository';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';

@Injectable()
export class ReviewAndSubmitService {
  constructor(
    @InjectRepository(ReviewAndSubmitTestSummaryRepository)
    private readonly repository: ReviewAndSubmitTestSummaryRepository,
    private readonly map: ReviewAndSubmitTestSummaryMap,
  ) {}

  async getTestSummaryRecords(
    orisCodes: number[],
    monPlanIds: string[],
  ): Promise<ReviewAndSubmitTestSummaryDTO[]> {
    try {
      if (monPlanIds && monPlanIds.length > 0) {
        return this.map.many(
          await this.repository.find({ where: { monPlanId: In(monPlanIds) } }),
        );
      }
      return this.map.many(
        await this.repository.find({ where: { orisCode: In(orisCodes) } }),
      );
    } catch (e) {
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

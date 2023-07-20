import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { getManager, In } from 'typeorm';
import { TestSummaryReviewAndSubmitRepository } from './test-summary-review-and-submit.repository';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { ReportingPeriod } from '../entities/reporting-period.entity';

const moment = require('moment');

@Injectable()
export class TestSummaryReviewAndSubmitService {
  constructor(
    @InjectRepository(TestSummaryReviewAndSubmitRepository)
    private readonly repository: TestSummaryReviewAndSubmitRepository,
    private readonly map: ReviewAndSubmitTestSummaryMap,
  ) {}

  returnManager(): any {
    return getManager();
  }

  async getTestSummaryRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
  ): Promise<ReviewAndSubmitTestSummaryDTO[]> {
    const filteredDates = [];

    let data: ReviewAndSubmitTestSummaryDTO[];
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

      let quarterList;
      if (quarters && quarters.length > 0) {
        quarterList = await this.returnManager().find(ReportingPeriod, {
          where: { periodAbbreviation: In(quarters) },
        });
      } else {
        quarterList = await this.returnManager().find(ReportingPeriod);
      }

      const newResults = [];

      for (const d of data) {
        let found = false;

        for (const rp of quarterList) {
          if (d.periodAbbreviation === rp.periodAbbreviation) {
            found = true;
            break;
          }

          if (
            moment(d.endDate).isSameOrAfter(rp.beginDate, 'day') &&
            moment(d.endDate).isSameOrBefore(rp.endDate, 'day')
          ) {
            found = true;
            d.periodAbbreviation = rp.periodAbbreviation;
            break;
          }
        }

        if (quarters && quarters.length > 0) {
          if (found) {
            newResults.push(d);
          }
        } else {
          newResults.push(d);
        }
      }

      data = newResults;

      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

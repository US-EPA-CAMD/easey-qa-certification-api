import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { EntityManager, In } from 'typeorm';

import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { TestSummaryReviewAndSubmitGlobalRepository } from './test-summary-review-and-submit-global.repository';
import { TestSummaryReviewAndSubmitRepository } from './test-summary-review-and-submit.repository';

const moment = require('moment');

@Injectable()
export class TestSummaryReviewAndSubmitService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly workspaceRepository: TestSummaryReviewAndSubmitRepository,
    private readonly globalRepository: TestSummaryReviewAndSubmitGlobalRepository,

    private readonly map: ReviewAndSubmitTestSummaryMap,
  ) {}

  returnManager(): any {
    return this.entityManager;
  }

  async getTestSummaryRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
  ): Promise<ReviewAndSubmitTestSummaryDTO[]> {
    const filteredDates = [];

    let repository;
    if (isWorkspace) {
      repository = this.workspaceRepository;
    } else {
      repository = this.globalRepository;
    }

    let data: ReviewAndSubmitTestSummaryDTO[];
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

import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { withTransaction } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In, DataSource } from 'typeorm';

import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { TestSummaryReviewAndSubmitGlobalRepository } from './test-summary-review-and-submit-global.repository';
import { TestSummaryReviewAndSubmitRepository } from './test-summary-review-and-submit.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common';

const moment = require('moment');

@Injectable()
export class TestSummaryReviewAndSubmitService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly workspaceRepository: TestSummaryReviewAndSubmitRepository,
    private readonly globalRepository: TestSummaryReviewAndSubmitGlobalRepository,

    private readonly map: ReviewAndSubmitTestSummaryMap,
    private readonly dataSource:DataSource
  ) {}

  returnManager(): any {
    return this.entityManager;
  }

  async getTestSummaryRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
    trx?: EntityManager,
  ): Promise<ReviewAndSubmitTestSummaryDTO[]> {
    const filteredDates = [];

    let repository;

    if (isWorkspace) {
      repository = withTransaction(this.workspaceRepository, trx);
    }

    let data: ReviewAndSubmitTestSummaryDTO[];
    try {
      if(isWorkspace)
      {
        if (monPlanIds && monPlanIds.length > 0) {
          data = await this.map.many(
            await repository.find({ where: { monPlanId: In(monPlanIds) } }),
          );
        } else {
          data = await this.map.many(
            await repository.find({ where: { orisCode: In(orisCodes) } }),
          );
        }
      }
      else
      {
        if (monPlanIds && monPlanIds.length > 0) {
          data = await this.map.many(
            await useSlaveRepository(this.dataSource, TestSummaryReviewAndSubmitGlobalRepository, async (repository) => repository.find({ where: { monPlanId: In(monPlanIds) } })))
        } else {
          data = await this.map.many(
            await useSlaveRepository(this.dataSource, TestSummaryReviewAndSubmitGlobalRepository, async (repository) => repository.find({ where: { orisCode: In(orisCodes) } })))
        }
      }

      const manager = trx || this.entityManager;
      let quarterList;
      if(isWorkspace)
      {
        if (quarters && quarters.length > 0) {
          quarterList = await manager.find(ReportingPeriod, {
            where: { periodAbbreviation: In(quarters) },
          });
        } else {
          quarterList = await manager.find(ReportingPeriod);
        }
      }
      else
      {
        if (quarters && quarters.length > 0) {
          const queryRunner = this.dataSource.createQueryRunner('slave');
          try{
              quarterList = await queryRunner.manager.find(ReportingPeriod, {
              where: { periodAbbreviation: In(quarters) },
            });
          }finally
          {
            await queryRunner.release()
          }
        }
        else 
        {
          const queryRunner = this.dataSource.createQueryRunner('slave');
          try{
            quarterList = await queryRunner.manager.find(ReportingPeriod);
          }
          finally
          {
            await queryRunner.release()
          }
        }
      }

      const newResults = [];

        if (data.length > 0 && isWorkspace) {
        const testSumIds = data.map(d => d.testSumId);

        const severities = await manager.query(
             `select t.test_sum_id, sc.severity_cd_description, sc.severity_cd from camdecmpswks.test_summary t
              JOIN camdecmpswks.check_session cs on cs.chk_session_id = t.chk_session_id
              JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd
              where t.test_sum_id = ANY($1);`,
        [testSumIds],
        );

        const severityMap:Map<string, {description:string,severityCode:string}> = new Map(
          severities.map((s: any) => [s.test_sum_id, { description: s.severity_cd_description, severityCode: s.severity_cd }])
        );

        for (const d of data) {
          let {description, severityCode} = severityMap.get(d.testSumId) ?? {};
          d.severityDescription = description
          d.severityCode = severityCode
        }
      }

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

  async getTestSummaryRecordsByTestSumIds(
    testSumIds: string[],
    isWorkspace: boolean = true,
    trx?: EntityManager,
  ): Promise<ReviewAndSubmitTestSummaryDTO[]> {

    let repository;

    if (isWorkspace) {
      repository = withTransaction(this.workspaceRepository, trx);
    } else {
      repository = withTransaction(this.globalRepository, trx);
    }

    let data: ReviewAndSubmitTestSummaryDTO[];

    try {
      data = [];
      if (testSumIds && testSumIds.length > 0) {
        data = await this.map.many(
          await repository.find({ where: { testSumId: In(testSumIds) } }),
        );
      } 
      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}

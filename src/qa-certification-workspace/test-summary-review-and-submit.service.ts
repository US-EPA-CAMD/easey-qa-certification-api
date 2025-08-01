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

        // Deduplicate records based on business keys
        data = this.deduplicateTestSummaryRecords(data);

        let quarterList;
        if (quarters && quarters.length > 0) {
          quarterList = await this.returnManager().find(ReportingPeriod, {
            where: { periodAbbreviation: In(quarters) },
          });
        } else {
          quarterList = await this.returnManager().find(ReportingPeriod);
        }

      const newResults = [];

          if (data.length > 0) {
          const testSumIds = data.map(d => d.testSumId);

          const severities = await this.entityManager.query(
               `select t.test_sum_id, sc.severity_cd_description, 
  sc.severity_cd from camdecmpswks.test_summary t
                JOIN camdecmpswks.check_session cs on cs.chk_session_id = 
  t.chk_session_id
                JOIN camdecmpsmd.severity_code sc on sc.severity_cd = 
  cs.severity_cd
                where t.test_sum_id = ANY($1);`,
          [testSumIds],
          );

          const severityMap:Map<string,




  {description:string,severityCode:string}> = new Map(
            severities.map((s: any) => [s.qa_cert_event_id, { description:
   s.severity_cd_description, severityCode: s.severity_cd }])
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

    private deduplicateTestSummaryRecords(data:
  ReviewAndSubmitTestSummaryDTO[]): ReviewAndSubmitTestSummaryDTO[] {
      const uniqueRecords = new Map<string,
  ReviewAndSubmitTestSummaryDTO>();

      for (const record of data) {
        // Business key: oris_code + location_info + system_component_id + test_type_cd + test_number + calendar_year + quarter + end_date
        const businessKey = `${record.orisCode}_${record.locationInfo}_${record.systemComponentId}_${record.testTypeCode}_${record.testNum}_${record.periodAbbreviation}_${record.endDate}`;

        if (!uniqueRecords.has(businessKey)) {
          uniqueRecords.set(businessKey, record);
        } else {
          // If duplicate found, keep the record with the most recent monPlanId (highest value)
          const existing = uniqueRecords.get(businessKey);
          if (record.monPlanId > existing.monPlanId) {
            uniqueRecords.set(businessKey, record);
          }
        }
      }

      return Array.from(uniqueRecords.values()).sort((a, b) => {
        // Sort by end_date DESC, then period_abbreviation DESC, then test_number ASC
        if (a.endDate !== b.endDate) {
          return new Date(b.endDate).getTime() - new
  Date(a.endDate).getTime();
        }
        if (a.periodAbbreviation !== b.periodAbbreviation) {
          return b.periodAbbreviation.localeCompare(a.periodAbbreviation);
        }
        return a.testNum.localeCompare(b.testNum);
      });
    }

    async getTestSummaryRecordsByTestSumIds(
      testSumIds: string[],
      isWorkspace: boolean = true,
    ): Promise<ReviewAndSubmitTestSummaryDTO[]> {

    let repository;

    if (isWorkspace) {
      repository = this.workspaceRepository;
    } else {
      repository = this.globalRepository;
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

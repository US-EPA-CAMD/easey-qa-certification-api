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
  // cache of monitor plan begin dates as tie breaker (monPlanId -> begin_date)
  private monPlanBeginMap: Map<string, Date> = new Map();

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

      //Build a map of monPlanId via monitor plan begin report period (Date)
      this.monPlanBeginMap.clear();
      const monPlanIdsInData = Array.from(
        new Set(
          (data ?? [])
            .map(d => d?.monPlanId)
            .filter((v): v is string => !!v),
        ),
      );
      if (monPlanIdsInData.length > 0) {
        // camdecmps.monitor_plan.begin_rpt_period_id -> camdecmpsmd.reporting_period.rpt_period_id
        const rows = await this.entityManager.query(
          `
            SELECT mp.mon_plan_id, rp.begin_date
            FROM camdecmps.monitor_plan mp
            JOIN camdecmpsmd.reporting_period rp
              ON rp.rpt_period_id = mp.begin_rpt_period_id
            WHERE mp.mon_plan_id = ANY ($1)
          `,
          [monPlanIdsInData],
        );
        for (const r of rows) {
          if (r?.mon_plan_id && r?.begin_date) {
            this.monPlanBeginMap.set(r.mon_plan_id, new Date(r.begin_date));
          }
        }
      }

      // Deduplicate with no monPlanId in key --tie breaker by plan begin period, else by date/period
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

        if (data.length > 0 && isWorkspace) {
        const testSumIds = data.map(d => d.testSumId);

        const severities = await this.entityManager.query(
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

  // Helpers kept private to avoid public API changes
  private parsePeriodAbbrev(p?: string): [number, number] {
    if (!p) return [0, 0];
    const m = p.match(/(\d{4})\s*Q?(\d)/i);
    return m ? [Number(m[1]), Number(m[2])] : [0, 0];
  }

  private compareStr(a?: string, b?: string) {
    return (a ?? '').localeCompare(b ?? '');
  }

  private compareDateAsc(a?: string | Date, b?: string | Date) {
    const da = a ? new Date(a).getTime() : 0;
    const db = b ? new Date(b).getTime() : 0;
    return da - db;
  }

  private compareDateDesc(a?: string | Date, b?: string | Date) {
    return -this.compareDateAsc(a, b);
  }

  private comparePeriodAsc(a?: string, b?: string) {
    const [ya, qa] = this.parsePeriodAbbrev(a);
    const [yb, qb] = this.parsePeriodAbbrev(b);
    if (ya !== yb) return ya - yb;
    return qa - qb;
  }

  private comparePeriodDesc(a?: string, b?: string) {
    return -this.comparePeriodAsc(a, b);
  }

  private deduplicateTestSummaryRecords(
    data: ReviewAndSubmitTestSummaryDTO[],
  ): ReviewAndSubmitTestSummaryDTO[] {
    const uniqueRecords = new Map<string, ReviewAndSubmitTestSummaryDTO>();

    for (const record of data) {
      // Business key via: oris + location + system/component id + test type + test number + year/qtr + end date
      const businessKey = `${record.orisCode}_${record.locationInfo}_${record.systemComponentId}_${record.testTypeCode}_${record.testNum}_${record.periodAbbreviation}_${record.endDate}`;

      if (!uniqueRecords.has(businessKey)) {
        uniqueRecords.set(businessKey, record);
      } else {
        const existing = uniqueRecords.get(businessKey)!;

        // Tie breaker without monPlanId:
        // Use monitor plan begin period when both exist
        const aBegin = record?.monPlanId
          ? this.monPlanBeginMap.get(record.monPlanId)
          : undefined;
        const bBegin = existing?.monPlanId
          ? this.monPlanBeginMap.get(existing.monPlanId)
          : undefined;

        if (aBegin && bBegin) {
          if (aBegin.getTime() > bBegin.getTime()) {
            uniqueRecords.set(businessKey, record);
          }
        } else {
          // Backup via: use endDate; if equal, later periodAbbreviation
          const td = this.compareDateDesc(record.endDate, existing.endDate);
          if (td > 0) {
            uniqueRecords.set(businessKey, record);
          } else if (td === 0) {
            if (
              this.comparePeriodDesc(
                record.periodAbbreviation,
                existing.periodAbbreviation,
              ) > 0
            ) {
              uniqueRecords.set(businessKey, record);
            }
          }
        }
      }
    }

    // Final sort via: location (unit/stack), system/component id, test type, test number, year/qtr, end date/time
    return Array.from(uniqueRecords.values()).sort((a, b) => {
      return (
        this.compareStr((a.orisCode ?? '').toString(), (b.orisCode ?? '').toString()) ||
        this.compareStr(a.locationInfo, b.locationInfo) ||
        this.compareStr(a.systemComponentId, b.systemComponentId) ||
        this.compareStr(a.testTypeCode, b.testTypeCode) ||
        this.compareStr(a.testNum, b.testNum) ||
        this.comparePeriodAsc(a.periodAbbreviation, b.periodAbbreviation) ||
        this.compareDateAsc(a.endDate, b.endDate)
      );
    });
  }
}

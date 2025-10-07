import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { withTransaction } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';

import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';
import { TeeReviewAndSubmitMap } from '../maps/tee-review-and-submit.map';
import { TeeReviewAndSubmitGlobalRepository } from './tee-review-and-submit-global.repository';
import { TeeReviewAndSubmitRepository } from './tee-review-and-submit.repository';

@Injectable()
export class TeeReviewAndSubmitService {
  // cache of monitor plan begin dates as tie breaker (monPlanId -> begin_date)
  private monPlanBeginMap: Map<string, Date> = new Map();

  constructor(
    private readonly entityManager: EntityManager,
    private readonly workspaceRepository: TeeReviewAndSubmitRepository,
    private readonly globalRepository: TeeReviewAndSubmitGlobalRepository,

    private readonly map: TeeReviewAndSubmitMap,
  ) {}

  returnManager(): any {
    return this.entityManager;
  }

  async getTeeRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
    trx?: EntityManager,
  ): Promise<TeeReviewAndSubmitDTO[]> {
    const filteredDates = [];

    let repository;
    if (isWorkspace) {
      repository = withTransaction(this.workspaceRepository, trx);
    } else {
      repository = withTransaction(this.globalRepository, trx);
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

// Build a map of monPlanId via monitor plan begin report period (Date)
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

      // Deduplicate with no monPlanId in key --tie breaker by plan begin period, else by later eventDate
      data = this.deduplicateTeeRecords(data);
      if (quarters && quarters.length > 0) {
        data = data.filter(f => quarters.includes(f.periodAbbreviation));
      }

      if (data.length > 0 && isWorkspace) {
        const testExtensionExemptionIdentifiers = data.map(d => d.testExtensionExemptionIdentifier);

        const manager = trx || this.entityManager;
        const severities = await manager.query(
             `select t.test_extension_exemption_id, sc.severity_cd_description, sc.severity_cd from camdecmpswks.test_extension_exemption t
              JOIN camdecmpswks.check_session cs on cs.chk_session_id = t.chk_session_id
              JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd
              where t.test_extension_exemption_id =  ANY($1);`,
        [testExtensionExemptionIdentifiers],
        );

        const severityMap:Map<string, {description:string,severityCode:string}> = new Map(
          severities.map((s: any) => [s.test_extension_exemption_id, { description: s.severity_cd_description, severityCode: s.severity_cd }])
        );

        for (const d of data) {
          let {description, severityCode} = severityMap.get(d.testExtensionExemptionIdentifier) ?? {};
          d.severityDescription = description
          d.severityCode = severityCode
        }
      }

      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Helpers to kept private to avoid public API changes
  private parsePeriodAbbrev(p?: string): [number, number] {
    if (!p) return [0, 0];
    const m = p.match(/(\d{4})\s*Q?(\d)/i);
    return m ? [Number(m[1]), Number(m[2])] : [0, 0];
  }

  private compareStr(a?: string, b?: string) {
    return (a ?? '').localeCompare(b ?? '');
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

  private deduplicateTeeRecords(
    data: TeeReviewAndSubmitDTO[],
  ): TeeReviewAndSubmitDTO[] {
    const uniqueRecords = new Map<string, TeeReviewAndSubmitDTO>();

    for (const record of data) {
      // Business key via: oris_code + location_info + system_component_id + year/qtr
      const businessKey = `${record.orisCode}_${record.locationInfo}_${record.systemComponentIdentifier}_${record.periodAbbreviation}`;

      if (!uniqueRecords.has(businessKey)) {
        uniqueRecords.set(businessKey, record);
      } else {
        const existing = uniqueRecords.get(businessKey)!;

        // Tie breaker without monPlanId:
        // Use monitor plan begin period when both exist; else later periodAbbreviation
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

    // Final sort via: oris, location (unit/stack), system/component id, year/qtr (ASC)
    return Array.from(uniqueRecords.values()).sort((a, b) => {
      return (
        this.compareStr((a.orisCode ?? '').toString(), (b.orisCode ?? '').toString()) ||
        this.compareStr(a.locationInfo, b.locationInfo) ||
        this.compareStr(a.systemComponentIdentifier, b.systemComponentIdentifier) ||
        this.comparePeriodAsc(a.periodAbbreviation, b.periodAbbreviation)
      );
    });
  }
}

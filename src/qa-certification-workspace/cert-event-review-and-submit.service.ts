import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { withTransaction } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';

import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { CertEventReviewAndSubmitMap } from '../maps/cert-event-review-and-submit.map';
import { CertEventReviewAndSubmitGlobalRepository } from './cert-event-review-and-submit-global.repository';
import { CertEventReviewAndSubmitRepository } from './cert-event-review-and-submit.repository';

const moment = require('moment');

@Injectable()
export class CertEventReviewAndSubmitService {
  // cache of monitor plan begin dates as tie breaker
  private monPlanBeginMap: Map<string, Date> = new Map();

  constructor(
    private readonly entityManager: EntityManager,
    private readonly workspaceRepository: CertEventReviewAndSubmitRepository,
    private readonly globalRepository: CertEventReviewAndSubmitGlobalRepository,
    private readonly map: CertEventReviewAndSubmitMap,
  ) {}

  returnManager(): any {
    return this.entityManager;
  }

  async getCertEventRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
    trx?: EntityManager,
  ): Promise<CertEventReviewAndSubmitDTO[]> {
    let data: CertEventReviewAndSubmitDTO[];

    let repository;
    if (isWorkspace) {
      repository = withTransaction(this.workspaceRepository, trx);
    } else {
      repository = withTransaction(this.globalRepository, trx);
    }

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
      data = this.deduplicateCertEventRecords(data);
      const manager = trx || this.entityManager;
      let quarterList: ReportingPeriod[];
      if (quarters && quarters.length > 0) {
        quarterList = await manager.find(ReportingPeriod, {
          where: { periodAbbreviation: In(quarters) },
        });
      } else {
        quarterList = await manager.find(ReportingPeriod);
      }

      const newResults = [];

        if (data.length > 0 && isWorkspace) {
        const qaCertEventIdentifiers = data.map(d => d.qaCertEventIdentifier);

        const severities = await manager.query(
             `select qce.qa_cert_event_id , sc.severity_cd_description, sc.severity_cd from camdecmpswks.qa_cert_event qce
              JOIN camdecmpswks.check_session cs on cs.chk_session_id = qce.chk_session_id
              JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd
              where qce.qa_cert_event_id = ANY($1);`,
        [qaCertEventIdentifiers],
        );

        const severityMap:Map<string, {description:string,severityCode:string}> = new Map(
          severities.map((s: any) => [s.qa_cert_event_id, { description: s.severity_cd_description, severityCode: s.severity_cd }])
        );

        for (const d of data) {
          let {description, severityCode} = severityMap.get(d.qaCertEventIdentifier) ?? {};
          d.severityDescription = description
          d.severityCode = severityCode
        }
      }

      for (const d of data) {
        let found = false;

        for (const rp of quarterList) {
          if (
            moment(d.eventDate.split(' ')[0]).isSameOrAfter(
              rp.beginDate,
              'day',
            ) &&
            moment(d.eventDate.split(' ')[0]).isSameOrBefore(rp.endDate, 'day')
          ) {
            found = true;
            d.periodAbbreviation = rp.periodAbbreviation;
            d.rptPeriodIdentifier = rp.id;
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

      return newResults;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Business key via: oris_code + location_info + system_component_id + event_code + event_date
  // Tie breaker via: latest plan begin period (if present) else later eventDate.
  // Final sort via: oris, location, system/component id, event code, event date/time DESC.
  private deduplicateCertEventRecords(
    data: CertEventReviewAndSubmitDTO[],
  ): CertEventReviewAndSubmitDTO[] {
    const uniqueRecords = new Map<string, CertEventReviewAndSubmitDTO>();

    for (const record of data) {
      const businessKey = `${record.orisCode}_${record.locationInfo}_${record.systemComponentIdentifier}_${record.qaCertEventCode}_${record.eventDate}`;

      if (!uniqueRecords.has(businessKey)) {
        uniqueRecords.set(businessKey, record);
      } else {
        const existing = uniqueRecords.get(businessKey)!;

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
          const aDate = record?.eventDate ? new Date(record.eventDate).getTime() : 0;
          const bDate = existing?.eventDate ? new Date(existing.eventDate).getTime() : 0;
          if (aDate > bDate) {
            uniqueRecords.set(businessKey, record);
          }
        }
      }
    }

    return Array.from(uniqueRecords.values()).sort((a, b) => {
      return (
        (a.orisCode ?? '').toString().localeCompare((b.orisCode ?? '').toString()) ||
        (a.locationInfo ?? '').localeCompare(b.locationInfo ?? '') ||
        (a.systemComponentIdentifier ?? '').localeCompare(
          b.systemComponentIdentifier ?? '',
        ) ||
        (a.qaCertEventCode ?? '').localeCompare(b.qaCertEventCode ?? '') ||
        (new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      );
    });
  }
}

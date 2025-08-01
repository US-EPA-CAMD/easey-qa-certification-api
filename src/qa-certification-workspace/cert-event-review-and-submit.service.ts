import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { EntityManager, In } from 'typeorm';

import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { CertEventReviewAndSubmitMap } from '../maps/cert-event-review-and-submit.map';
import { CertEventReviewAndSubmitGlobalRepository } from './cert-event-review-and-submit-global.repository';
import { CertEventReviewAndSubmitRepository } from './cert-event-review-and-submit.repository';

const moment = require('moment');

@Injectable()
export class CertEventReviewAndSubmitService {
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
  ): Promise<CertEventReviewAndSubmitDTO[]> {
    let data: CertEventReviewAndSubmitDTO[];

    let repository;
    if (isWorkspace) {
      repository = this.workspaceRepository;
    } else {
      repository = this.globalRepository;
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

      // Deduplicate records based on business keys
      data = this.deduplicateCertEventRecords(data);

      let quarterList: ReportingPeriod[];
      if (quarters && quarters.length > 0) {
        quarterList = await this.returnManager().find(ReportingPeriod, {
          where: { periodAbbreviation: In(quarters) },
        });
      } else {
        quarterList = await this.returnManager().find(ReportingPeriod);
      }

      const newResults = [];

      if (data.length > 0 && isWorkspace) {
        const qaCertEventIdentifiers = data.map(d => d.qaCertEventIdentifier);

        const severities = await this.entityManager.query(
          `select qce.qa_cert_event_id, sc.severity_cd_description, sc.severity_cd
           from camdecmpswks.qa_cert_event qce
                    JOIN camdecmpswks.check_session cs on cs.chk_session_id = qce.chk_session_id
                    JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd
           where qce.qa_cert_event_id = ANY ($1);`,
          [qaCertEventIdentifiers],
        );

        const severityMap: Map<string, { description: string, severityCode: string }> = new Map(
          severities.map((s: any) => [s.qa_cert_event_id, {
            description: s.severity_cd_description,
            severityCode: s.severity_cd
          }])
        );

        for (const d of data) {
          let { description, severityCode } = severityMap.get(d.qaCertEventIdentifier) ?? {};
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
    private deduplicateCertEventRecords(data: CertEventReviewAndSubmitDTO[]): CertEventReviewAndSubmitDTO[] {
      const uniqueRecords = new Map<string,
  CertEventReviewAndSubmitDTO>();

      for (const record of data) {
        // Business key: oris_code + location_info + system_component_id + event_code + event_date
        const businessKey =
  `${record.orisCode}_${record.locationInfo}_${record.systemComponentIdentifier}_${record.qaCertEventCode}_${record.eventDate}`;

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

      // Sort by event_date DESC
      return Array.from(uniqueRecords.values()).sort((a, b) => {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();});
    }
  }


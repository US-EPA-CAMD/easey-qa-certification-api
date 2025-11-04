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
}

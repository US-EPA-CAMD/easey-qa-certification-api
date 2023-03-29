import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { getManager, In } from 'typeorm';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { CertEventReviewAndSubmitRepository } from './cert-event-review-and-submit.repository';
import { CertEventReviewAndSubmitMap } from '../maps/cert-event-review-and-submit.map';
import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';

const moment = require('moment');

@Injectable()
export class CertEventReviewAndSubmitService {
  constructor(
    @InjectRepository(CertEventReviewAndSubmitRepository)
    private readonly repository: CertEventReviewAndSubmitRepository,
    private readonly map: CertEventReviewAndSubmitMap,
  ) {}

  returnManager(): any {
    return getManager();
  }

  async getCertEventRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
  ): Promise<CertEventReviewAndSubmitDTO[]> {
    const filteredDates = [];

    let data;
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
            moment(d.eventDate.split(' ')[0]).isSameOrAfter(
              rp.beginDate,
              'day',
            ) &&
            moment(d.eventDate.split(' ')[0]).isSameOrBefore(rp.endDate, 'day')
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
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ReportingPeriod } from '../entities/reporting-period.entity';

@Injectable()
export class ReportingPeriodRepository extends Repository<ReportingPeriod> {
  constructor(entityManager: EntityManager) {
    super(ReportingPeriod, entityManager);
  }
}

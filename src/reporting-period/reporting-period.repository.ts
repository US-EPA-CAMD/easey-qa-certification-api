import { ReportingPeriod } from '../entities/reporting-period.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ReportingPeriod)
export class ReportingPeriodRepository extends Repository<ReportingPeriod> {}

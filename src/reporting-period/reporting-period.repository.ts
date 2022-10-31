import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ReportingPeriod)
export class ReportingPeriodRepository extends Repository<ReportingPeriod> {}

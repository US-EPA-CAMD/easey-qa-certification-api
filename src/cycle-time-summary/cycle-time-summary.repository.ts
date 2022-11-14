import { CycleTimeSummary } from '../entities/cycle-time-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CycleTimeSummary)
export class CycleTimeSummaryRepository extends Repository<CycleTimeSummary> {}

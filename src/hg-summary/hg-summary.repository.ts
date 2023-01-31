import { HgSummary } from '../entities/hg-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(HgSummary)
export class HgSummaryRepository extends Repository<HgSummary> {}

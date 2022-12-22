import { HgSummary } from '../entities/workspace/hg-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(HgSummary)
export class HgSummaryWorkspaceRepository extends Repository<HgSummary> {}

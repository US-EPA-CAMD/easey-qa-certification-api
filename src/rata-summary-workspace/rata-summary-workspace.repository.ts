import { Repository, EntityRepository } from 'typeorm';
import { RataSummary } from '../entities/workspace/rata-summary.entity';

@EntityRepository(RataSummary)
export class RataSummaryWorkspaceRepository extends Repository<RataSummary> {}

import { Repository, EntityRepository } from 'typeorm';
import { RataSummary } from '../entities/rata-summary.entity';

@EntityRepository(RataSummary)
export class RataSummaryRepository extends Repository<RataSummary> {}

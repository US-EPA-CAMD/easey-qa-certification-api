import { Repository, EntityRepository } from 'typeorm';

import { LinearitySummary } from '../entities/linearity-summary.entity';

@EntityRepository(LinearitySummary)
export class LinearitySummaryRepository extends Repository<LinearitySummary> {}

import { Repository, EntityRepository } from 'typeorm';

import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';

@EntityRepository(LinearitySummary)
export class LinearitySummaryWorkspaceRepository extends Repository<
  LinearitySummary
> {}

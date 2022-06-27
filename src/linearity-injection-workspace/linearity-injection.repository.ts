import { Repository, EntityRepository } from 'typeorm';

import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';

@EntityRepository(LinearityInjection)
export class LinearityInjectionWorkspaceRepository extends Repository<
  LinearityInjection
> {}

import { Repository, EntityRepository } from 'typeorm';

import { LinearityInjection } from '../entities/linearity-injection.entity';

@EntityRepository(LinearityInjection)
export class LinearityInjectionRepository extends Repository<
  LinearityInjection
> {}

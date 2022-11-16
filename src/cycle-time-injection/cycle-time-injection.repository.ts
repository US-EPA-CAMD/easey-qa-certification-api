import { EntityRepository, Repository } from 'typeorm';
import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';

@EntityRepository(CycleTimeInjection)
export class CycleTimeInjectionRepository extends Repository<
  CycleTimeInjection
> {}

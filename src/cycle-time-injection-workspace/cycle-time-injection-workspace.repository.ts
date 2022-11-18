import { EntityRepository, Repository } from 'typeorm';
import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';

@EntityRepository(CycleTimeInjection)
export class CycleTimeInjectionWorkspaceRepository extends Repository<
  CycleTimeInjection
> {}

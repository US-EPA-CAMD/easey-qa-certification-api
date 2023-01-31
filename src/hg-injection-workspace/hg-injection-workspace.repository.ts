import { HgInjection } from '../entities/workspace/hg-injection.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(HgInjection)
export class HgInjectionWorkspaceRepository extends Repository<HgInjection> {}

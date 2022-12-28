import { EntityRepository, Repository } from 'typeorm';
import { HgInjection } from '../entities/hg-injection.entity';

@EntityRepository(HgInjection)
export class HgInjectionRepository extends Repository<HgInjection> {}

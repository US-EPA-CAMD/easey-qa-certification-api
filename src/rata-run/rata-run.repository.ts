import { EntityRepository, Repository } from 'typeorm';
import { RataRun } from '../entities/rata-run.entity';

@EntityRepository(RataRun)
export class RataRunRepository extends Repository<RataRun> {}

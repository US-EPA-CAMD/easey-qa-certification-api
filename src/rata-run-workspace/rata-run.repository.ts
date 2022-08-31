import { EntityRepository, Repository } from 'typeorm';
import { RataRun } from '../entities/workspace/rata-run.entity';

@EntityRepository(RataRun)
export class RataRunWorkspaceRepository extends Repository<RataRun> {}

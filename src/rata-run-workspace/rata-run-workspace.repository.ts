import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { RataRun } from '../entities/workspace/rata-run.entity';

@Injectable()
export class RataRunWorkspaceRepository extends Repository<RataRun> {
  constructor(entityManager: EntityManager) {
    super(RataRun, entityManager);
  }
}

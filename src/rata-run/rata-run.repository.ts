import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { RataRun } from '../entities/rata-run.entity';

@Injectable()
export class RataRunRepository extends Repository<RataRun> {
  constructor(entityManager: EntityManager) {
    super(RataRun, entityManager);
  }
}

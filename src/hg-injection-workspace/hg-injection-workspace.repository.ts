import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HgInjection } from '../entities/workspace/hg-injection.entity';

@Injectable()
export class HgInjectionWorkspaceRepository extends Repository<HgInjection> {
  constructor(entityManager: EntityManager) {
    super(HgInjection, entityManager);
  }
}

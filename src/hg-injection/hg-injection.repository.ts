import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HgInjection } from '../entities/hg-injection.entity';

@Injectable()
export class HgInjectionRepository extends Repository<HgInjection> {
  constructor(entityManager: EntityManager) {
    super(HgInjection, entityManager);
  }
}

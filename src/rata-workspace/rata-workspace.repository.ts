import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Rata } from '../entities/workspace/rata.entity';

@Injectable()
export class RataWorkspaceRepository extends Repository<Rata> {
  constructor(entityManager: EntityManager) {
    super(Rata, entityManager);
  }
}

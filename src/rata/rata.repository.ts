import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Rata } from '../entities/rata.entity';

@Injectable()
export class RataRepository extends Repository<Rata> {
  constructor(entityManager: EntityManager) {
    super(Rata, entityManager);
  }
}

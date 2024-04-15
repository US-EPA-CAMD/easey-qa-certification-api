import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitDefaultTest } from '../entities/unit-default-test.entity';

@Injectable()
export class UnitDefaultTestRepository extends Repository<UnitDefaultTest> {
  constructor(entityManager: EntityManager) {
    super(UnitDefaultTest, entityManager);
  }
}

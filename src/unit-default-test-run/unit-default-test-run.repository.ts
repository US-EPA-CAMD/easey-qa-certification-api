import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitDefaultTestRun } from '../entities/unit-default-test-run.entity';

@Injectable()
export class UnitDefaultTestRunRepository extends Repository<
  UnitDefaultTestRun
> {
  constructor(entityManager: EntityManager) {
    super(UnitDefaultTestRun, entityManager);
  }
}

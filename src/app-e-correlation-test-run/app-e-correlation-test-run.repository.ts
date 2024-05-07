import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';

@Injectable()
export class AppECorrelationTestRunRepository extends Repository<
  AppECorrelationTestRun
> {
  constructor(entityManager: EntityManager) {
    super(AppECorrelationTestRun, entityManager);
  }
}

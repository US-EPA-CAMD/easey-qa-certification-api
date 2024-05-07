import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';

@Injectable()
export class AppendixETestSummaryRepository extends Repository<
  AppECorrelationTestSummary
> {
  constructor(entityManager: EntityManager) {
    super(AppECorrelationTestSummary, entityManager);
  }
}

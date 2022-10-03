import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AppECorrelationTestSummary)
export class AppendixETestSummaryRepository extends Repository<
  AppECorrelationTestSummary
> {}

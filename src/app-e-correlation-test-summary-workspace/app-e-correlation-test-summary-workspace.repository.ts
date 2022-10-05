import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AppECorrelationTestSummary)
export class AppendixETestSummaryWorkspaceRepository extends Repository<
  AppECorrelationTestSummary
> {}

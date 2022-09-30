import { AeCorrelationSummaryTest } from 'src/entities/workspace/app-e-correlation-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AeCorrelationSummaryTest)
export class AppendixETestSummaryWorkspaceRepository extends Repository<
  AeCorrelationSummaryTest
> {}

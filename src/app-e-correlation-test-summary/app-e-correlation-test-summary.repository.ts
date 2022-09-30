import { AeCorrelationSummaryTest } from 'src/entities/ae-correlation-test-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AeCorrelationSummaryTest)
export class AppendixETestSummaryWorkspaceRepository extends Repository<
AeCorrelationSummaryTest
> {}

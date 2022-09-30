import { AeCorrelationSummaryTest } from '../entities/app-e-correlation-test-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AeCorrelationSummaryTest)
export class AppendixETestSummaryRepository extends Repository<
  AeCorrelationSummaryTest
> {}

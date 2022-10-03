import { EntityRepository, Repository } from 'typeorm';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';

@EntityRepository(AppECorrelationTestRun)
export class AppECorrelationTestRunRepository extends Repository<
  AppECorrelationTestRun
> {}

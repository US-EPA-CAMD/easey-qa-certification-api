import { EntityRepository, Repository } from 'typeorm';
import { AppECorrelationTestRun } from '../entities/workspace/app-e-correlation-test-run.entity';

@EntityRepository(AppECorrelationTestRun)
export class AppECorrelationTestRunWorkspaceRepository extends Repository<
  AppECorrelationTestRun
> {}

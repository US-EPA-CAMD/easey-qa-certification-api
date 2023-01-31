import { UnitDefaultTestRun } from '../entities/workspace/unit-default-test-run.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UnitDefaultTestRun)
export class UnitDefaultTestRunWorkspaceRepository extends Repository<
  UnitDefaultTestRun
> {}

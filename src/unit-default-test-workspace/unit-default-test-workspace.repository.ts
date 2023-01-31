import { UnitDefaultTest } from '../entities/workspace/unit-default-test.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UnitDefaultTest)
export class UnitDefaultTestWorkspaceRepository extends Repository<
  UnitDefaultTest
> {}

import { UnitDefaultTestRun } from '../entities/unit-default-test-run.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UnitDefaultTestRun)
export class UnitDefaultTestRunRepository extends Repository<UnitDefaultTestRun> {}

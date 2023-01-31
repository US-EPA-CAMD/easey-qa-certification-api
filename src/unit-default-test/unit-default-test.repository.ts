import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UnitDefaultTest)
export class UnitDefaultTestRepository extends Repository<UnitDefaultTest> {}

import { EntityRepository, Repository } from 'typeorm';
import { TestQualification } from '../entities/workspace/test-qualification.entity';

@EntityRepository(TestQualification)
export class TestQualificationWorkspaceRepository extends Repository<
  TestQualification
> {}

import { TestQualification } from '../entities/workspace/test-qualification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TestQualification)
export class TestQualificationWorkspaceRepository extends Repository<
  TestQualification
> {}

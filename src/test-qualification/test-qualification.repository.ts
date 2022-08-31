import { TestQualification } from '../entities/test-qualification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TestQualification)
export class TestQualificationRepository extends Repository<
  TestQualification
> {}

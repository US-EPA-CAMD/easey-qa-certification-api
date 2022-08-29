import { TestResultCode } from '../entities/test-result-code.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TestResultCode)
export class TestResultCodeRepository extends Repository<TestResultCode> {}

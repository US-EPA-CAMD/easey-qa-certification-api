import { AirEmissionTest } from '../entities/air-emission-test.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AirEmissionTest)
export class AirEmissionTestRepository extends Repository<AirEmissionTest> {}

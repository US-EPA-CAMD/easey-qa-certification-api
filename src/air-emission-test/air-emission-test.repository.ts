import { AirEmissionTest } from '../entities/air-emission-test';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AirEmissionTest)
export class AirEmissionTestRepository extends Repository<AirEmissionTest> {}

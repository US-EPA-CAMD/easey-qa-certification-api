import { AirEmissionTesting } from '../entities/air-emission-test.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AirEmissionTesting)
export class AirEmissionTestingRepository extends Repository<
  AirEmissionTesting
> {}

import { AirEmissionTest } from '../entities/workspace/air-emission-test.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AirEmissionTest)
export class AirEmissionTestWorkspaceRepository extends Repository<
  AirEmissionTest
> {}

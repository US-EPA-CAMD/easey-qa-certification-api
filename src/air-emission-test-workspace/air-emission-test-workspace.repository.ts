import { AirEmissionTest } from '../entities/workspace/air-emission-test';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AirEmissionTest)
export class AirEmissionTestWorkspaceRepository extends Repository<
  AirEmissionTest
> {}

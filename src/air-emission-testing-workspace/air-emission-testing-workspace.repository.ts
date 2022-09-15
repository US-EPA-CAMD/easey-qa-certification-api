import { AirEmissionTesting } from '../entities/workspace/air-emission-test.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AirEmissionTesting)
export class AirEmissionTestingWorkspaceRepository extends Repository<
  AirEmissionTesting
> {}

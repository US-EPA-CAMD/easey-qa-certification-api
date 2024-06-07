import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AirEmissionTesting } from '../entities/workspace/air-emission-test.entity';

@Injectable()
export class AirEmissionTestingWorkspaceRepository extends Repository<
  AirEmissionTesting
> {
  constructor(entityManager: EntityManager) {
    super(AirEmissionTesting, entityManager);
  }
}

import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AirEmissionTesting } from '../entities/air-emission-test.entity';

@Injectable()
export class AirEmissionTestingRepository extends Repository<
  AirEmissionTesting
> {
  constructor(entityManager: EntityManager) {
    super(AirEmissionTesting, entityManager);
  }
}

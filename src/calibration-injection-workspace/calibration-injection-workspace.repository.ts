import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CalibrationInjection } from '../entities/workspace/calibration-injection.entity';

@Injectable()
export class CalibrationInjectionWorkspaceRepository extends Repository<
  CalibrationInjection
> {
  constructor(entityManager: EntityManager) {
    super(CalibrationInjection, entityManager);
  }
}

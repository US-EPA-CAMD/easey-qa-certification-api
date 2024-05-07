import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CalibrationInjection } from '../entities/calibration-injection.entity';

@Injectable()
export class CalibrationInjectionRepository extends Repository<
  CalibrationInjection
> {
  constructor(entityManager: EntityManager) {
    super(CalibrationInjection, entityManager);
  }
}

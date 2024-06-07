import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { OnlineOfflineCalibration } from '../entities/online-offline-calibration.entity';

@Injectable()
export class OnlineOfflineCalibrationRepository extends Repository<
  OnlineOfflineCalibration
> {
  constructor(entityManager: EntityManager) {
    super(OnlineOfflineCalibration, entityManager);
  }
}

import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { OnlineOfflineCalibration } from '../entities/workspace/online-offline-calibration.entity';

@Injectable()
export class OnlineOfflineCalibrationWorkspaceRepository extends Repository<
  OnlineOfflineCalibration
> {
  constructor(entityManager: EntityManager) {
    super(OnlineOfflineCalibration, entityManager);
  }
}

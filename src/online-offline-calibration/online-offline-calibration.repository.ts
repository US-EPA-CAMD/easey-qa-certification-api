import { Repository, EntityRepository } from 'typeorm';
import { OnlineOfflineCalibration } from '../entities/online-offline-calibration.entity';

@EntityRepository(OnlineOfflineCalibration)
export class OnlineOfflineCalibrationRepository extends Repository<
  OnlineOfflineCalibration
> {}

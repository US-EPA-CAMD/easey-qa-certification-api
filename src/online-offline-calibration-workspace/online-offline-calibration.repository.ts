import { Repository, EntityRepository } from 'typeorm';
import { OnlineOfflineCalibration } from '../entities/workspace/online-offline-calibration.entity';

@EntityRepository(OnlineOfflineCalibration)
export class OnlineOfflineCalibrationWorkspaceRepository extends Repository<
  OnlineOfflineCalibration
> {}

import { EntityRepository, Repository } from 'typeorm';
import { CalibrationInjection } from '../entities/workspace/calibration-injection.entity';

@EntityRepository(CalibrationInjection)
export class CalibrationInjectionWorkspaceRepository extends Repository<
  CalibrationInjection
> {}

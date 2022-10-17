import { EntityRepository, Repository } from 'typeorm';
import { CalibrationInjection } from '../entities/calibration-injection.entity';

@EntityRepository(CalibrationInjection)
export class CalibrationInjectionRepository extends Repository<
  CalibrationInjection
> {}

import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputFromOil } from '../entities/app-e-heat-input-from-oil.entity';

@EntityRepository(AppEHeatInputFromOil)
export class AppEHeatInputFromOilRepository extends Repository<
  AppEHeatInputFromOil
> {}

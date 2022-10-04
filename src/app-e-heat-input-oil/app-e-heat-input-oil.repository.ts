import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputOil } from '../entities/app-e-heat-input-oil.entity';

@EntityRepository(AppEHeatInputOil)
export class AppEHeatInputOilRepository extends Repository<AppEHeatInputOil> {}

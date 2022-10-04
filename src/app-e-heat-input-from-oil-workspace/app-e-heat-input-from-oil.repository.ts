import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputFromOil } from '../entities/workspace/app-e-heat-input-from-oil.entity';

@EntityRepository(AppEHeatInputFromOil)
export class AppEHeatInputFromOilWorkspaceRepository extends Repository<AppEHeatInputFromOil> {}

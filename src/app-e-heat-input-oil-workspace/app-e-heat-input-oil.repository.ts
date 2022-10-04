import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputOil } from '../entities/workspace/app-e-heat-input-oil.entity';

@EntityRepository(AppEHeatInputOil)
export class AppEHeatInputOilWorkspaceRepository extends Repository<AppEHeatInputOil> {}

import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputFromGas } from '../entities/workspace/app-e-heat-input-from-gas.entity';

@EntityRepository(AppEHeatInputFromGas)
export class AppEHeatInputFromGasWorkspaceRepository extends Repository<
  AppEHeatInputFromGas
> {}

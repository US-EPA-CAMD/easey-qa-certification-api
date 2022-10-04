import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';

@EntityRepository(AppEHeatInputFromGas)
export class AppEHeatInputFromGasRepository extends Repository<
  AppEHeatInputFromGas
> {}

import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';

@EntityRepository(AppEHeatInputFromGas)
export class AppEHeatInputFromGasRepository extends Repository<
  AppEHeatInputFromGas
> {
  async getAppEHeatInputFromGasById(id: string): Promise<AppEHeatInputFromGas> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.id = :id', {
        id,
      });

    return query.getOne();
  }

  async getAppEHeatInputFromGasByTestRunId(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromGas[]> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.appECorrTestRunId = :appECorrTestRunId', {
        appECorrTestRunId,
      });

    return query.getMany();
  }
}

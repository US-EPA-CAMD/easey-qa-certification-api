import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputFromOil } from '../entities/app-e-heat-input-from-oil.entity';

@EntityRepository(AppEHeatInputFromOil)
export class AppEHeatInputFromOilRepository extends Repository<
  AppEHeatInputFromOil
> {
  async getAppEHeatInputFromOilById(id: string): Promise<AppEHeatInputFromOil> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.id = :id', {
        id,
      });

    return query.getOne();
  }

  async getAppEHeatInputFromOilsByTestRunId(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromOil[]> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.appECorrTestRunId = :appECorrTestRunId', {
        appECorrTestRunId,
      });

    return query.getMany();
  }

  async getAppEHeatInputFromOilsByTestRunIds(
    appECorrTestRunIds: string[],
  ): Promise<AppEHeatInputFromOil[]> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.appECorrTestRunId IN (:...appECorrTestRunIds)', {
        appECorrTestRunIds,
      });

    return query.getMany();
  }
}

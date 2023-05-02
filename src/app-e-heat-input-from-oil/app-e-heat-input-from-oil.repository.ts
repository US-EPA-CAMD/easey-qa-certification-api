import { EntityRepository, Repository } from 'typeorm';
import { AppEHeatInputFromOil } from '../entities/app-e-heat-input-from-oil.entity';

@EntityRepository(AppEHeatInputFromOil)
export class AppEHeatInputFromOilRepository extends Repository<
  AppEHeatInputFromOil
> {
  async getAppEHeatInputFromOilById(id: string): Promise<AppEHeatInputFromOil> {
    const query = this.createQueryBuilder('aehio')
      .leftJoinAndSelect('aehio.system', 'ms')
      .where('aehio.id = :id', {
        id,
      });

    return query.getOne();
  }

  async getAppEHeatInputFromOilByTestRunIdAndMonSysID(
    appECorrTestRunId: string,
    monitoringSystemID: string,
  ): Promise<AppEHeatInputFromOil> {
    const query = this.createQueryBuilder('aehio')
      .leftJoinAndSelect('aehio.system', 'ms')
      .where('aehio.appECorrTestRunId = :appECorrTestRunId', {
        appECorrTestRunId,
      })
      .andWhere('ms.monitoringSystemID = :monitoringSystemID', {
        monitoringSystemID,
      });

    return query.getOne();
  }

  async getAppEHeatInputFromOilsByTestRunId(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromOil[]> {
    const query = this.createQueryBuilder('aehio')
      .leftJoinAndSelect('aehio.system', 'ms')
      .where('aehio.appECorrTestRunId = :appECorrTestRunId', {
        appECorrTestRunId,
      });

    return query.getMany();
  }

  async getAppEHeatInputFromOilsByTestRunIds(
    appECorrTestRunIds: string[],
  ): Promise<AppEHeatInputFromOil[]> {
    const query = this.createQueryBuilder('aehio')
      .leftJoinAndSelect('aehio.system', 'ms')
      .where('aehio.appECorrTestRunId IN (:...appECorrTestRunIds)', {
        appECorrTestRunIds,
      });

    return query.getMany();
  }
}

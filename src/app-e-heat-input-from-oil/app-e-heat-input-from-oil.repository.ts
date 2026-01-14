import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AppEHeatInputFromOil } from '../entities/app-e-heat-input-from-oil.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class AppEHeatInputFromOilRepository extends Repository<
  AppEHeatInputFromOil
> {
  constructor(entityManager: EntityManager) {
    super(AppEHeatInputFromOil, entityManager);
  }

  async getAppEHeatInputFromOilById(id: string): Promise<AppEHeatInputFromOil> {
      return withSlaveConnection(this.manager.connection, async (qr) => {
        return qr.createQueryBuilder(AppEHeatInputFromOil, 'aehio')
        .leftJoinAndSelect('aehio.system', 'ms')
        .where('aehio.id = :id', {
        id,}).getOne()}
        );
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
       return withSlaveConnection(this.manager.connection, async (qr) => {
        return qr.createQueryBuilder(AppEHeatInputFromOil, 'aehio')
        .leftJoinAndSelect('aehio.system', 'ms')
        .where('aehio.appECorrTestRunId = :appECorrTestRunId', {
          appECorrTestRunId,
        }).getMany()}
      );
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

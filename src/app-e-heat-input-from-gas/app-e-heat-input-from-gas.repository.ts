import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

@Injectable()
export class AppEHeatInputFromGasRepository extends Repository<
  AppEHeatInputFromGas
> {
  constructor( entityManager: EntityManager) {
    super(AppEHeatInputFromGas, entityManager);
  }

  async getAppEHeatInputFromGasById(id: string): Promise<AppEHeatInputFromGas> {
     return withSlaveConnection(this.manager.connection, async (qr) => {
        return qr.createQueryBuilder(AppEHeatInputFromGas, 'aehig')
        .leftJoinAndSelect('aehig.system', 'ms')
        .where('aehig.id = :id', {
          id,
         }).getOne()});
  }

  async getAppEHeatInputFromGasByTestRunIdAndMonSysID(
    appECorrTestRunId: string,
    monitoringSystemID: string,
  ): Promise<AppEHeatInputFromGas> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.appECorrTestRunId = :appECorrTestRunId', {
        appECorrTestRunId,
      })
      .andWhere('ms.monitoringSystemID = :monitoringSystemID', {
        monitoringSystemID,
      });

    return query.getOne();
  }

  async getAppEHeatInputFromGasByTestRunId(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromGas[]> {
       return withSlaveConnection(this.manager.connection, async (qr) => {
        return qr.createQueryBuilder(AppEHeatInputFromGas, 'aehig')
        .leftJoinAndSelect('aehig.system', 'ms')
        .where('aehig.appECorrTestRunId = :appECorrTestRunId', {
          appECorrTestRunId,
        }).getMany()
       })
  }

  async getAppEHeatInputFromGasesByTestRunIds(
    appECorrTestRunIds: string[],
  ): Promise<AppEHeatInputFromGas[]> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.appECorrTestRunId IN (:...appECorrTestRunIds)', {
        appECorrTestRunIds,
      });

    return query.getMany();
  }
}

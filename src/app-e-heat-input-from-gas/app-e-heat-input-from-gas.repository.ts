import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';
import { useSlaveQueryRunner } from '../utilities/user-slave-query';

@Injectable()
export class AppEHeatInputFromGasRepository extends Repository<
  AppEHeatInputFromGas
> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(AppEHeatInputFromGas, entityManager);
  }

  async getAppEHeatInputFromGasById(id: string): Promise<AppEHeatInputFromGas> {
     return useSlaveQueryRunner(this.dataSource, async (qr) => {
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
       return useSlaveQueryRunner(this.dataSource, async (qr) => {
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

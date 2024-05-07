import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';

@Injectable()
export class AppEHeatInputFromGasRepository extends Repository<
  AppEHeatInputFromGas
> {
  constructor(entityManager: EntityManager) {
    super(AppEHeatInputFromGas, entityManager);
  }

  async getAppEHeatInputFromGasById(id: string): Promise<AppEHeatInputFromGas> {
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.id = :id', {
        id,
      });

    return query.getOne();
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
    const query = this.createQueryBuilder('aehig')
      .leftJoinAndSelect('aehig.system', 'ms')
      .where('aehig.appECorrTestRunId = :appECorrTestRunId', {
        appECorrTestRunId,
      });

    return query.getMany();
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

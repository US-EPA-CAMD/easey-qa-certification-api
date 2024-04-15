import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AppEHeatInputFromGas } from '../entities/workspace/app-e-heat-input-from-gas.entity';

@Injectable()
export class AppEHeatInputFromGasWorkspaceRepository extends Repository<
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

  async getAppEHeatInputFromGasesByTestRunId(
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

  async findDuplicate(
    aeHiGasId: string,
    testSumId: string,
    opLevel: number,
    runNumber: number,
    monSysId: string,
  ): Promise<AppEHeatInputFromGas> {
    const query = this.createQueryBuilder('aehig')
      .innerJoin('aehig.appECorrelationTestRun', 'aerun')
      .innerJoin('aerun.appECorrelationTestSummary', 'aesum')
      .innerJoin('aesum.testSummary', 'testsum')
      .innerJoin('aehig.system', 'monsys')
      .where('testsum.id = :testsumid', { testsumid: testSumId })
      .andWhere('aesum.operatingLevelForRun = :oplevel', { oplevel: opLevel })
      .andWhere('aerun.runNumber = :runnumber', { runnumber: runNumber })
      .andWhere('monsys.monitoringSystemID = :monsysid', {
        monsysid: monSysId,
      });

    if (aeHiGasId) query.andWhere('aehig.id != :id', { id: aeHiGasId });

    return query.getOne();
  }
}

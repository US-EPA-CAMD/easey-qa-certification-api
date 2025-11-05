import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { FuelFlowToLoadTestDTO } from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestRepository } from './fuel-flow-to-load-test.repository';
import { In, DataSource } from 'typeorm';
import { useSlaveRepository } from '../utilities/use-slave-repository';
@Injectable()
export class FuelFlowToLoadTestService {
  constructor(
    private readonly repository: FuelFlowToLoadTestRepository,
    private readonly map: FuelFlowToLoadTestMap,
    private readonly dataSource: DataSource,
  ) {}

  async getFuelFlowToLoadTests(
    testSumId: string,
  ): Promise<FuelFlowToLoadTestDTO[]> {
    const records = await useSlaveRepository(this.dataSource, FuelFlowToLoadTestRepository, async (repository) => repository.find({ where: { testSumId } }));

    return this.map.many(records);
  }

  async getFuelFlowToLoadTest(
    id: string,
    testSumId: string,
  ): Promise<FuelFlowToLoadTestDTO> {
    const result = await useSlaveRepository(this.dataSource, FuelFlowToLoadTestRepository, async (repository) => repository.findOneBy({
      id,
      testSumId,
    }));

    if (!result) {
      throw new EaseyException(
        new Error(
          `Fuel Flow To Load Test record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getFuelFlowToLoadTestBySumIds(
    testSumIds: string[],
  ): Promise<FuelFlowToLoadTestDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FuelFlowToLoadTestDTO[]> {
    return this.getFuelFlowToLoadTestBySumIds(testSumIds);
  }
}

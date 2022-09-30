import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { FuelFlowToLoadTestDTO } from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestRepository } from './fuel-flow-to-load-test.repository';
import { In } from 'typeorm';

@Injectable()
export class FuelFlowToLoadTestService {
  constructor(
    private readonly repository: FuelFlowToLoadTestRepository,
    private readonly map: FuelFlowToLoadTestMap,
  ) {}

  async getFuelFlowToLoadTests(
    testSumId: string,
  ): Promise<FuelFlowToLoadTestDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowToLoadTest(id: string): Promise<FuelFlowToLoadTestDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Fuel Flow To Load Test record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

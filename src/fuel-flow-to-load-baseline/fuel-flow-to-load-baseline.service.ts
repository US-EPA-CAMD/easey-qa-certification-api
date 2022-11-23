import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { FuelFlowToLoadBaselineRepository } from './fuel-flow-to-load-baseline.repository';

@Injectable()
export class FuelFlowToLoadBaselineService {
  constructor(
    private readonly repository: FuelFlowToLoadBaselineRepository,
    private readonly map: FuelFlowToLoadBaselineMap,
  ) {}

  async getFuelFlowToLoadBaselines(
    testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowToLoadBaseline(
    id: string,
    testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Fuel Flow To Load Baseline record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getFuelFlowToLoadBaselineBySumIds(
    testSumIds: string[],
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FuelFlowToLoadBaselineDTO[]> {
    return this.getFuelFlowToLoadBaselineBySumIds(testSumIds);
  }
}

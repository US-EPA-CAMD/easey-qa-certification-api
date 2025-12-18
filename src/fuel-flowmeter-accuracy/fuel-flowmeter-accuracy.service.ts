import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In, DataSource } from 'typeorm';

import {
  FuelFlowmeterAccuracyDTO,
  FuelFlowmeterAccuracyRecordDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import { FuelFlowmeterAccuracyRepository } from './fuel-flowmeter-accuracy.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class FuelFlowmeterAccuracyService {
  constructor(
    private readonly map: FuelFlowmeterAccuracyMap,
    private readonly repository: FuelFlowmeterAccuracyRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getFuelFlowmeterAccuracies(
    testSumId: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO[]> {
    const records = await useSlaveRepository(this.dataSource, FuelFlowmeterAccuracyRepository, async (repository) => repository.find({ where: { testSumId } }));

    return this.map.many(records);
  }

  async getFuelFlowmeterAccuracy(
    id: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO> {
    const result = await useSlaveRepository(this.dataSource, FuelFlowmeterAccuracyRepository, async (repository) => repository.findOneBy({ id }));

    if (!result) {
      throw new EaseyException(
        new Error(
          `Fuel Flowmeter Accuracy record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getFuelFlowmeterAccuraciesByTestSumIds(
    testSumIds: string[],
  ): Promise<FuelFlowmeterAccuracyDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FuelFlowmeterAccuracyDTO[]> {
    return this.getFuelFlowmeterAccuraciesByTestSumIds(testSumIds);
  }
}

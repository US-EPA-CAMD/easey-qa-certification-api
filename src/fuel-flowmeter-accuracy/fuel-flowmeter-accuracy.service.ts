import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import {
  FuelFlowmeterAccuracyDTO,
  FuelFlowmeterAccuracyRecordDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyRepository } from './fuel-flowmeter-accuracy.repository';
import { In } from 'typeorm';

@Injectable()
export class FuelFlowmeterAccuracyService {
  constructor(
    private readonly map: FuelFlowmeterAccuracyMap,
    @InjectRepository(FuelFlowmeterAccuracyRepository)
    private readonly repository: FuelFlowmeterAccuracyRepository,
  ) {}

  async getFuelFlowmeterAccuracies(
    testSumId: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowmeterAccuracy(
    id: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Fuel Flowmeter Accuracy record not found with Record Id [${id}].`,
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

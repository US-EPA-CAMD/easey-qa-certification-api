import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { CalibrationInjectionRepository } from './calibration-injection.repository';

@Injectable()
export class CalibrationInjectionService {
  constructor(
    private readonly map: CalibrationInjectionMap,
    private readonly repository: CalibrationInjectionRepository,
  ) {}

  async getCalibrationInjections(
    testSumId: string,
  ): Promise<CalibrationInjectionDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getCalibrationInjection(
    id: string,
    testSumId: string,
  ): Promise<CalibrationInjectionDTO> {
    const result = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Calibration Injection record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getCalibrationInjectionByTestSumIds(
    testSumIds: string[],
  ): Promise<CalibrationInjectionDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<CalibrationInjectionDTO[]> {
    const calInjs = await this.getCalibrationInjectionByTestSumIds(testSumIds);
    return calInjs;
  }
}

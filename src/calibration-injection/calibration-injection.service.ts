import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { CalibrationInjectionRepository } from './calibration-injection.repository';
import { In } from 'typeorm';

@Injectable()
export class CalibrationInjectionService {
  constructor(
    private readonly map: CalibrationInjectionMap,
    @InjectRepository(CalibrationInjectionRepository)
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
    const result = await this.repository.findOne({
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

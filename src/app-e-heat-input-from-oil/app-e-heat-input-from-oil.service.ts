import { HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AppEHeatInputFromOilRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { AppEHeatInputFromOilDTO } from '../dto/app-e-heat-input-from-oil.dto';
import { In } from 'typeorm';

@Injectable()
export class AppEHeatInputFromOilService {
  constructor(
    @InjectRepository(AppEHeatInputFromOilRepository)
    private readonly repository: AppEHeatInputFromOilRepository,
    private readonly map: AppEHeatInputFromOilMap,
  ) {}

  async getAppEHeatInputFromOilRecords(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromOilDTO[]> {
    const records = await this.repository.find({
      where: { appECorrTestRunId },
    });

    return this.map.many(records);
  }

  async getAppEHeatInputFromOilRecord(
    id: string,
  ): Promise<AppEHeatInputFromOilDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input from Oil record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getAppEHeatInputFromOilRecordsByTestSumIds(
    testSumIds: string[],
  ): Promise<AppEHeatInputFromOilDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<AppEHeatInputFromOilDTO[]> {
    return this.getAppEHeatInputFromOilRecordsByTestSumIds(testSumIds);
  }
}

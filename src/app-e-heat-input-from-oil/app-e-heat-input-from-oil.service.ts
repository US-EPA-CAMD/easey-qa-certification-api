import { HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AppEHeatInputFromOilRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { AppEHeatInputFromOilDTO } from '../dto/app-e-heat-input-from-oil.dto';

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
    const records = await this.repository.getAppEHeatInputFromOilsByTestRunId(
      appECorrTestRunId,
    );

    return this.map.many(records);
  }

  async getAppEHeatInputFromOilRecord(
    id: string,
  ): Promise<AppEHeatInputFromOilDTO> {
    const result = await this.repository.getAppEHeatInputFromOilById(id);

    if (!result) {
      throw new EaseyException(
        new Error(
          `Appendix E Heat Input from Oil record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getAppEHeatInputFromOilRecordsByTestRunIds(
    testSumIds: string[],
  ): Promise<AppEHeatInputFromOilDTO[]> {
    const results = await this.repository.getAppEHeatInputFromOilsByTestRunIds(
      testSumIds,
    );
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<AppEHeatInputFromOilDTO[]> {
    return this.getAppEHeatInputFromOilRecordsByTestRunIds(testSumIds);
  }
}

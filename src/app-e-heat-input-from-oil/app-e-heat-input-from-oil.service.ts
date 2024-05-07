import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { AppEHeatInputFromOilDTO } from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { AppEHeatInputFromOilRepository } from './app-e-heat-input-from-oil.repository';

@Injectable()
export class AppEHeatInputFromOilService {
  constructor(
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

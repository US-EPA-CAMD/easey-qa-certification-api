import { HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AppEHeatInputOilRepository } from './app-e-heat-input-oil.repository';
import { AppEHeatInputOilMap } from '../maps/app-e-heat-input-oil-map';
import { AppEHeatInputOilDTO } from '../dto/app-e-heat-input-oil.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class AppEHeatInputOilService {
  constructor(
    @InjectRepository(AppEHeatInputOilRepository)
    private readonly repository: AppEHeatInputOilRepository,
    private readonly map: AppEHeatInputOilMap,
  ) {}

  async getAppEHeatInputOilRecords(aeCorrTestRunId: string): Promise<AppEHeatInputOilDTO[]> {
    const records = await this.repository.find({
      where: { aeCorrTestRunId },
    });

    return this.map.many(records);
  }

  async getAppEHeatInputOilRecord(id: string): Promise<AppEHeatInputOilDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input Oil record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

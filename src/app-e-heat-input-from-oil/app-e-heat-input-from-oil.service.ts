import { HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AppEHeatInputFromOilRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { AppEHeatInputFromOilDto } from '../dto/app-e-heat-input-from-oil.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class AppEHeatInputFromOilService {
  constructor(
    @InjectRepository(AppEHeatInputFromOilRepository)
    private readonly repository: AppEHeatInputFromOilRepository,
    private readonly map: AppEHeatInputFromOilMap,
  ) {}

  async getAppEHeatInputFromOilRecords(aeCorrTestRunId: string): Promise<AppEHeatInputFromOilDto[]> {
    const records = await this.repository.find({
      where: { aeCorrTestRunId },
    });

    return this.map.many(records);
  }

  async getAppEHeatInputFromOilRecord(id: string): Promise<AppEHeatInputFromOilDto> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input from Oil record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { AppECorrelationTestRunRepository } from './app-e-correlation-test-run.repository';

@Injectable()
export class AppECorrelationTestRunService {
  constructor(
    private readonly map: AppECorrelationTestRunMap,
    @InjectRepository(AppECorrelationTestRunRepository)
    private readonly repository: AppECorrelationTestRunRepository,
  ) {}

  async getAppECorrelationTestRuns(
    appECorrTestSumId: string,
  ): Promise<AppECorrelationTestRunBaseDTO[]> {
    const records = await this.repository.find({
      where: { appECorrTestSumId },
    });

    return this.map.many(records);
  }

  async getAppECorrelationTestRun(
    id: string,
  ): Promise<AppECorrelationTestRunBaseDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Correlation Test Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.map.one(result);
  }
}

import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { AppEHeatInputFromGasService } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.service';
import { AppEHeatInputFromOilService } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.service';
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
    private readonly repository: AppECorrelationTestRunRepository,
    @Inject(forwardRef(() => AppEHeatInputFromGasService))
    private readonly appEHeatInputFromGasService: AppEHeatInputFromGasService,
    @Inject(forwardRef(() => AppEHeatInputFromOilService))
    private readonly appEHeatInputFromOilService: AppEHeatInputFromOilService,
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
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Appendix E Correlation Test Run record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }
    return this.map.one(result);
  }

  async getAppECorrelationTestRunsByAppECorrelationTestSumId(
    appECorrTestSumIds: string[],
  ): Promise<AppECorrelationTestRunDTO[]> {
    const results = await this.repository.find({
      where: { appECorrTestSumId: In(appECorrTestSumIds) },
    });
    return this.map.many(results);
  }

  async export(
    appECorrTestSumIds: string[],
  ): Promise<AppECorrelationTestRunDTO[]> {
    const appECorrelationTestRuns = await this.getAppECorrelationTestRunsByAppECorrelationTestSumId(
      appECorrTestSumIds,
    );

    const testRunIds: string[] = appECorrelationTestRuns.map(i => i.id);

    if (testRunIds.length > 0) {
      const hIGas = await this.appEHeatInputFromGasService.export(testRunIds);
      const hIOil = await this.appEHeatInputFromOilService.export(testRunIds);

      appECorrelationTestRuns.forEach(s => {
        s.appendixEHeatInputFromGasData = hIGas.filter(
          i => i.appECorrTestRunId === s.id,
        );
        s.appendixEHeatInputFromOilData = hIOil.filter(
          i => i.appECorrTestRunId === s.id,
        );
      });
    }

    return appECorrelationTestRuns;
  }
}

import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestRunMap } from './app-e-correlation-test-run.map';

@Injectable()
export class AppECorrelationTestSummaryMap extends BaseMap<
  AppECorrelationTestSummary,
  AppECorrelationTestSummaryDTO
> {
  constructor(
    private readonly appECorrelationTestRunMap: AppECorrelationTestRunMap,
  ) {
    super();
  }

  public async one(
    entity: AppECorrelationTestSummary,
  ): Promise<AppECorrelationTestSummaryDTO> {
    const appECorrelationTestRuns = entity.appECorrelationTestRuns
      ? await this.appECorrelationTestRunMap.many(
          entity.appECorrelationTestRuns,
        )
      : [];

    return {
      id: entity.id,
      testSumId: entity.testSumId,
      operatingLevelForRun: entity.operatingLevelForRun,
      meanReferenceValue: entity.meanReferenceValue,
      calculatedMeanReferenceValue: entity.calculatedMeanReferenceValue,
      averageHourlyHeatInputRate: entity.averageHourlyHeatInputRate,
      fFactor: entity.fFactor,
      calculatedAverageHourlyHeatInputRate:
        entity.calculatedAverageHourlyHeatInputRate,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
      appECorrelationTestRunData: appECorrelationTestRuns,
    };
  }
}

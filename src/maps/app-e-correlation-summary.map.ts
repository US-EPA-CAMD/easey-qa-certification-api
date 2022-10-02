import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AeCorrelationSummaryTest } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryDTO } from '../dto/app-e-correlation-test-summary.dto';

@Injectable()
export class AeCorrelationSummaryMap extends BaseMap<
  AeCorrelationSummaryTest,
  AppECorrelationTestSummaryDTO
> {
  public async one(
    entity: AeCorrelationSummaryTest,
  ): Promise<AppECorrelationTestSummaryDTO> {
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
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

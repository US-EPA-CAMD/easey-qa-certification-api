import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { LinearityInjectionMap } from './linearity-injection.map';
import { LinearitySummary } from '../entities/linearity-summary.entity';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';

@Injectable()
export class LinearitySummaryMap extends BaseMap<
  LinearitySummary,
  LinearitySummaryDTO
> {
  constructor(private readonly injectionMap: LinearityInjectionMap) {
    super();
  }

  public async one(entity: LinearitySummary): Promise<LinearitySummaryDTO> {
    const injections = entity.injections
      ? await this.injectionMap.many(entity.injections)
      : [];

    return {
      id: entity.id,
      testSumId: entity.testSumId,
      gasLevelCode: entity.gasLevelCode,
      meanMeasuredValue: entity.meanMeasuredValue,
      calculatedMeanMeasuredValue: entity.calculatedMeanMeasuredValue,
      meanReferenceValue: entity.meanReferenceValue,
      calculatedMeanReferenceValue: entity.calculatedMeanReferenceValue,
      percentError: entity.percentError,
      calculatedPercentError: entity.calculatedPercentError,
      apsIndicator: entity.apsIndicator,
      calculatedAPSIndicator: entity.calculatedAPSIndicator,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
      linearityInjectionData: injections,
    };
  }
}

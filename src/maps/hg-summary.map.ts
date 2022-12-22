import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummary } from '../entities/hg-summary.entity';

@Injectable()
export class HgSummaryMap extends BaseMap<HgSummary, HgSummaryDTO> {
  public async one(entity: HgSummary): Promise<HgSummaryDTO> {
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
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
      HgInjectionData: [],
    };
  }
}

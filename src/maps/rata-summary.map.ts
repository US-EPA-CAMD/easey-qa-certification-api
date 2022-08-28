import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { RataSummaryDTO } from '../dto/rata-summary.dto';
import { RataSummary } from '../entities/rata-summary.entity';
import { RataRunMap } from './rata-run.map';

@Injectable()
export class RataSummaryMap extends BaseMap<RataSummary, RataSummaryDTO> {
  constructor(private readonly rataRunMap: RataRunMap) {
    super();
  }
  public async one(entity: RataSummary): Promise<RataSummaryDTO> {
    const rataRuns = entity.RataRuns
      ? await this.rataRunMap.many(entity.RataRuns)
      : [];

    return {
      id: entity.id,
      rataId: entity.rataId,
      operatingLevelCode: entity.operatingLevelCode,
      averageGrossUnitLoad: entity.averageGrossUnitLoad,
      calculatedAverageGrossUnitLoad: entity.calculatedAverageGrossUnitLoad,
      referenceMethodCode: entity.referenceMethodCode,
      meanCEMValue: entity.meanCEMValue,
      calculatedMeanCEMValue: entity.calculatedMeanCEMValue,
      meanRATAReferenceValue: entity.meanRATAReferenceValue,
      calculatedMeanRATAReferenceValue: entity.calculatedMeanRATAReferenceValue,
      meanDifference: entity.meanDifference,
      calculatedMeanDifference: entity.calculatedMeanDifference,
      standardDeviationDifference: entity.standardDeviationDifference,
      calculatedStandardDeviationDifference:
        entity.calculatedStandardDeviationDifference,
      confidenceCoefficient: entity.confidenceCoefficient,
      calculatedConfidenceCoefficient: entity.calculatedConfidenceCoefficient,
      tValue: entity.tValue,
      calculatedTValue: entity.calculatedTValue,
      apsIndicator: entity.apsIndicator,
      calculatedApsIndicator: entity.calculatedApsIndicator,
      apsCode: entity.apsCode,
      relativeAccuracy: entity.relativeAccuracy,
      calculatedRelativeAccuracy: entity.calculatedRelativeAccuracy,
      biasAdjustmentFactor: entity.biasAdjustmentFactor,
      calculatedBiasAdjustmentFactor: entity.calculatedBiasAdjustmentFactor,
      co2OrO2ReferenceMethodCode: entity.co2OrO2ReferenceMethodCode,
      stackDiameter: entity.stackDiameter,
      stackArea: entity.stackArea,
      calculatedStackArea: entity.calculatedStackArea,
      numberOfTraversePoints: entity.numberOfTraversePoints,
      calculatedWAF: entity.calculatedWAF,
      calculatedCalculatedWAF: entity.calculatedCalculatedWAF,
      defaultWAF: entity.defaultWAF,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
      rataRunData: rataRuns,
    };
  }
}

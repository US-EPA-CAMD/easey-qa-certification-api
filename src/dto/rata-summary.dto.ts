import { RataRunImportDTO } from './rata-run.dto';

export class RataSummaryBaseDTO {
  relativeAccuracy: number;
  biasAdjustmentFactor: number;
  meanCEMValue: number;
  meanRataReferenceValue: number;
  operatingLevelCode: string;
  meanDifference: number;
  defaultWaf: number;
  averageGrossUnitLoad: number;
  apsIndicator: number;
  standardDeviationDifference: number;
  confidenceCoefficent: number;
  co2OrO2ReferenceMethodCode: string;
  referenceMethodCode: string;
  tValue: number;
  stackDiameter: number;
  stackArea: number;
  calculatedWaf: number;
  numberOfTraversePoints: number;
  apsCode: string;
}

export class RataSummaryRecordDTO extends RataSummaryBaseDTO {
  id: string;
  rataId: string;
  calculatedRelativeAccuracy: number;
  calculatedBiasAdjustmentFactor: number;
  calculatedMeanCEMValue: number;
  calculatedMeanRataReferenceValue: number;
  calculatedMeanDifference: number;
  calculatedAverageGrossUnitLoad: number;
  calculatedApsIndicator: number;
  calculatedStandardDeviationDifference: number;
  calculatedConfidenceCoefficent: number;
  calculatedTValue: number;
  calculatedStackArea: number;
  calculatedCalculatedWaf: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataSummaryImporetData extends RataSummaryBaseDTO {
  rataRunData: RataRunImportDTO[];
}

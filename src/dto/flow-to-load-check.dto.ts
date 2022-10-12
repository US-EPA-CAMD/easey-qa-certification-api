const Key = 'Flow To Load Check';

export class FlowToLoadCheckBaseDTO {
  testBasisCode: string;
  biasAdjustedIndicator: number;
  averageAbsolutePercentDifference: number;
  numberOfHours: number;
  numberOfHoursExcludedForFuel: number;
  numberOfHoursExcludedForRamping: number;
  numberOfHoursExcludedForBypass: number;
  numberOfHoursExcludedPreRata: number;
  numberOfHoursExcludedTest: number;
  numberOfHoursExcludedForMainAndBypass: number;
  operatingLevelCode: string;
}

export class FlowToLoadCheckRecordDTO extends FlowToLoadCheckBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FlowToLoadCheckImportDTO extends FlowToLoadCheckBaseDTO {}

export class FlowToLoadCheckDTO extends FlowToLoadCheckRecordDTO {}

const Key = 'Flow To Load Check';

export class FlowToLoadCheckBaseDTO {
  testBasisCode: string;
  biasAdjustedIndicator: number;
  avgAbsolutePercentDiff: number;
  numberOfHours: number;
  numberOfHoursExcludedForFuel: number;
  numberOfHoursExcludedRamping: number;
  numberOfHoursExcludedBypass: number;
  numberOfHoursExcludedPreRATA: number;
  numberOfHoursExcludedTest: number;
  numberOfHoursExcMainBypass: number;
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

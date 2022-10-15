const KEY = 'Fuel Flow To Load Baseline';

export class FuelFlowToLoadBaselineBaseDTO {
  accuracyTestNumber: number;
  peiTestNumber: number;
  averageFuelFlowRate: number;
  averageLoad: number;
  baselineFuelFlowToLoadRatio: number;
  fuelFlowToLoadUOMCode: string;
  averageHourlyHeatInputRate: number;
  baselineGHR: number;
  ghrUnitsOfMeasureCode: string;
  numberOfHoursExcludedCofiring: number;
  numberOfHoursExcludedRamping: number;
  numberOfHoursExcludedLowRange: number;
}

export class FuelFlowToLoadBaselineRecordDTO extends FuelFlowToLoadBaselineBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FuelFlowToLoadBaselineImportDTO extends FuelFlowToLoadBaselineBaseDTO {}

export class FuelFlowToLoadBaselineDTO extends FuelFlowToLoadBaselineRecordDTO {}

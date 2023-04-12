import { IsNumber, IsString } from 'class-validator';
const KEY = 'Fuel Flow To Load Baseline';

export class FuelFlowToLoadBaselineBaseDTO {
  @IsNumber()
  accuracyTestNumber: number;
  @IsNumber()
  peiTestNumber: number;
  @IsNumber()
  averageFuelFlowRate: number;
  @IsNumber()
  averageLoad: number;
  @IsNumber()
  baselineFuelFlowToLoadRatio: number;
  @IsString()
  fuelFlowToLoadUOMCode: string;
  @IsNumber()
  averageHourlyHeatInputRate: number;
  @IsNumber()
  baselineGHR: number;
  @IsString()
  ghrUnitsOfMeasureCode: string;
  @IsNumber()
  numberOfHoursExcludedCofiring: number;
  @IsNumber()
  numberOfHoursExcludedRamping: number;
  @IsNumber()
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

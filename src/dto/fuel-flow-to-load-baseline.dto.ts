import { IsNumber, IsOptional, IsString } from 'class-validator';
const KEY = 'Fuel Flow To Load Baseline';

export class FuelFlowToLoadBaselineBaseDTO {
  @IsOptional()
  @IsNumber()
  accuracyTestNumber: number;
  @IsOptional()
  @IsNumber()
  peiTestNumber: number;
  @IsOptional()
  @IsNumber()
  averageFuelFlowRate: number;
  @IsOptional()
  @IsNumber()
  averageLoad: number;
  @IsOptional()
  @IsNumber()
  baselineFuelFlowToLoadRatio: number;
  @IsOptional()
  @IsString()
  fuelFlowToLoadUOMCode: string;
  @IsOptional()
  @IsNumber()
  averageHourlyHeatInputRate: number;
  @IsOptional()
  @IsNumber()
  baselineGHR: number;
  @IsOptional()
  @IsString()
  ghrUnitsOfMeasureCode: string;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedCofiring: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedRamping: number;
  @IsOptional()
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

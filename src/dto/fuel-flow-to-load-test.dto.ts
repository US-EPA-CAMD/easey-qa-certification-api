import { IsNumber, IsOptional, IsString } from 'class-validator';
const KEY = 'Fuel Flow To Load Test';

export class FuelFlowToLoadTestBaseDTO {
  @IsOptional()
  @IsString()
  testBasisCode: string;
  @IsOptional()
  @IsNumber()
  averageDifference: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursUsed: number;
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

export class FuelFlowToLoadTestRecordDTO extends FuelFlowToLoadTestBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FuelFlowToLoadTestImportDTO extends FuelFlowToLoadTestBaseDTO {}

export class FuelFlowToLoadTestDTO extends FuelFlowToLoadTestRecordDTO {}

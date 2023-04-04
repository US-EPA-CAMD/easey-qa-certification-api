import { IsNumber, IsString } from 'class-validator';
const KEY = 'Fuel Flow To Load Test';

export class FuelFlowToLoadTestBaseDTO {
  @IsString()
  testBasisCode: string;
  @IsNumber()
  averageDifference: number;
  @IsNumber()
  numberOfHoursUsed: number;
  @IsNumber()
  numberOfHoursExcludedCofiring: number;
  @IsNumber()
  numberOfHoursExcludedRamping: number;
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

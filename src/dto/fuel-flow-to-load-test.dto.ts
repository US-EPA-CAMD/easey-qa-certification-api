const KEY = 'Fuel Flow To Load Test';

export class FuelFlowToLoadTestBaseDTO {
  testBasisCode: string;
  averageDifference: number;
  numberOfHoursUsed: number;
  numberOfHoursExcludedCofiring: number;
  numberOfHoursExcludedRamping: number;
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

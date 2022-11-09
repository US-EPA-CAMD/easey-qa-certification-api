const KEY = 'Fuel Flowmeter Accuracy';
export class FuelFlowmeterAccuracyBaseDTO {
  accuracyTestMethodCode: string;
  reinstallationHour: number;
  lowFuelAccuracy: number;
  midFuelAccuracy: number;
  highFuelAccuracy: number;
}

export class FuelFlowmeterAccuracyRecordDTO extends FuelFlowmeterAccuracyBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  reinstallationDate: Date;
}

export class FuelFlowmeterAccuracyImportDTO extends FuelFlowmeterAccuracyBaseDTO {}

export class FuelFlowmeterAccuracyDTO extends FuelFlowmeterAccuracyRecordDTO {}

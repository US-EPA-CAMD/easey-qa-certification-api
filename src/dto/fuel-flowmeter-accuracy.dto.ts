const KEY = 'Fuel Flowmeter Accuracy';
export class FuelFlowmeterAccuracyBaseDTO {
  accuracyTestMethodCode: string;
  reinstallationHour: number;
  lowFuelAccuracy: number;
  midFuelAccuracy: number;
  highFuelAccuracy: number;
  reinstallationDate: Date;
}

export class FuelFlowmeterAccuracyRecordDTO extends FuelFlowmeterAccuracyBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FuelFlowmeterAccuracyImportDTO extends FuelFlowmeterAccuracyBaseDTO {}

export class FuelFlowmeterAccuracyDTO extends FuelFlowmeterAccuracyRecordDTO {}

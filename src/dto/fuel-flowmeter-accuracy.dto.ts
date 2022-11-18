const KEY = 'Fuel Flowmeter Accuracy';
export class FuelFlowmeterAccuracyBaseDTO {
  accuracyTestMethodCode: string;
  lowFuelAccuracy: number;
  midFuelAccuracy: number;
  highFuelAccuracy: number;
  reinstallationDate: string;
  reinstallationHour: number;
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

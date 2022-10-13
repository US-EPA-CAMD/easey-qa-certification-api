const KEY = 'Flow To Load Reference';

export class FlowToLoadReferenceBaseDTO {
  rataTestNumber: string;
  operatingLevelCode: string;
  averageGrossUnitLoad: number;
  averageReferenceMethodFlow: number;
  referenceFlowToLoadRatio: number;
  averageHourlyHeatInputRate: number;
  referenceGrossHeatRate: number;
  calculatedSeparateReferenceIndicator: number;
}

export class FlowToLoadReferenceRecordDTO extends FlowToLoadReferenceBaseDTO {
  id: string;
  testSumId: string;
  calculatedAverageGrossUnitLoad: number;
  calculatedAverageReferenceMethodFlow: number;
  calculatedReferenceFlowToLoadRatio: number;
  calculatedReferenceGrossHeatRate: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FlowToLoadReferenceImportDTO extends FlowToLoadReferenceBaseDTO {}

export class FlowToLoadReferenceDTO extends FlowToLoadReferenceRecordDTO {}

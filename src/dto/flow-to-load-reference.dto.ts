const KEY = 'Flow To Load Reference';

export class FlowToLoadReferenceBaseDTO {
  rataTestNumber: string;
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
  operatingLevelCode: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FlowToLoadReferenceImportDTO extends FlowToLoadReferenceBaseDTO {}

export class FlowToLoadReferenceDTO extends FlowToLoadReferenceRecordDTO {}

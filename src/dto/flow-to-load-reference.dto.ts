import { IsNumber, IsString } from 'class-validator';
const KEY = 'Flow To Load Reference';

export class FlowToLoadReferenceBaseDTO {
  @IsString()
  rataTestNumber: string;
  @IsString()
  operatingLevelCode: string;
  @IsNumber()
  averageGrossUnitLoad: number;
  @IsNumber()
  averageReferenceMethodFlow: number;
  @IsNumber()
  referenceFlowLoadRatio: number;
  @IsNumber()
  averageHourlyHeatInputRate: number;
  @IsNumber()
  referenceGrossHeatRate: number;
  @IsNumber()
  calcSeparateReferenceIndicator: number;
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

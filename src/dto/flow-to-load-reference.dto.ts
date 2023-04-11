import { IsNumber, IsOptional, IsString } from 'class-validator';
const KEY = 'Flow To Load Reference';

export class FlowToLoadReferenceBaseDTO {
  @IsOptional()
  @IsString()
  rataTestNumber: string;
  @IsOptional()
  @IsString()
  operatingLevelCode: string;
  @IsOptional()
  @IsNumber()
  averageGrossUnitLoad: number;
  @IsOptional()
  @IsNumber()
  averageReferenceMethodFlow: number;
  @IsOptional()
  @IsNumber()
  referenceFlowLoadRatio: number;
  @IsOptional()
  @IsNumber()
  averageHourlyHeatInputRate: number;
  @IsOptional()
  @IsNumber()
  referenceGrossHeatRate: number;
  @IsOptional()
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

import { IsNumber, IsOptional, IsString } from 'class-validator';

const Key = 'Flow To Load Check';

export class FlowToLoadCheckBaseDTO {
  @IsOptional()
  @IsString()
  testBasisCode?: string;
  @IsOptional()
  @IsNumber()
  biasAdjustedIndicator?: number;
  @IsOptional()
  @IsNumber()
  averageAbsolutePercentDifference?: number;
  @IsOptional()
  @IsNumber()
  numberOfHours?: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedForFuel?: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedRamping?: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedBypass?: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedPreRATA?: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedTest?: number;
  @IsOptional()
  @IsNumber()
  numberOfHoursExcludedMainBypass?: number;
  @IsOptional()
  @IsString()
  operatingLevelCode?: string;
}

export class FlowToLoadCheckRecordDTO extends FlowToLoadCheckBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FlowToLoadCheckImportDTO extends FlowToLoadCheckBaseDTO {}

export class FlowToLoadCheckDTO extends FlowToLoadCheckRecordDTO {}

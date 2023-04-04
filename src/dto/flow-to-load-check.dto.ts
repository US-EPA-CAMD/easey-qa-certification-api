import { IsNumber, IsString } from 'class-validator';

const Key = 'Flow To Load Check';

export class FlowToLoadCheckBaseDTO {
  @IsString()
  testBasisCode: string;
  @IsNumber()
  biasAdjustedIndicator: number;
  @IsNumber()
  avgAbsolutePercentDiff: number;
  @IsNumber()
  numberOfHours: number;
  @IsNumber()
  numberOfHoursExcludedForFuel: number;
  @IsNumber()
  numberOfHoursExcludedRamping: number;
  @IsNumber()
  numberOfHoursExcludedBypass: number;
  @IsNumber()
  numberOfHoursExcludedPreRATA: number;
  @IsNumber()
  numberOfHoursExcludedTest: number;
  @IsNumber()
  numberOfHoursExcMainBypass: number;
  @IsString()
  operatingLevelCode: string;
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

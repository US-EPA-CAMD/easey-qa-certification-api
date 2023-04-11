import {
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
} from './unit-default-test-run.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UnitDefaultTestBaseDTO {
  @IsString()
  fuelCode: string;
  @IsNumber()
  noxDefaultRate: number;
  @IsOptional()
  @IsString()
  operatingConditionCode: string;
  @IsOptional()
  @IsString()
  groupID: string;
  @IsOptional()
  @IsNumber()
  numberOfUnitsInGroup: number;
  @IsOptional()
  @IsNumber()
  numberOfTestsForGroup: number;
}

export class UnitDefaultTestRecordDTO extends UnitDefaultTestBaseDTO {
  id: string;
  testSumId: string;
  calculatedNoxDefaultRate: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class UnitDefaultTestImportDTO extends UnitDefaultTestBaseDTO {
  unitDefaultTestRunData: UnitDefaultTestRunImportDTO[];
}

export class UnitDefaultTestDTO extends UnitDefaultTestRecordDTO {
  unitDefaultTestRunData: UnitDefaultTestRunDTO[];
}

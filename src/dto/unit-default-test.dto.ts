import {
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
} from './unit-default-test-run.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UnitDefaultTestBaseDTO {
  @IsOptional()
  @IsString()
  fuelCode?: string;
  @IsOptional()
  @IsNumber()
  noxDefaultRate?: number;
  @IsOptional()
  @IsString()
  operatingConditionCode?: string;
  @IsOptional()
  @IsString()
  groupId?: string;
  @IsOptional()
  @IsNumber()
  numberOfUnitsInGroup?: number;
  @IsOptional()
  @IsNumber()
  numberOfTestsForGroup?: number;
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

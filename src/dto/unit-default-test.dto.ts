import {
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
} from './unit-default-test-run.dto';
import { IsNumber, IsOptional, IsString, ValidationArguments, IsInRange } from 'class-validator';

export class UnitDefaultTestBaseDTO {
  @IsOptional()
  @IsString()
  fuelCode?: string;
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place.`;
      },
    },
  )
  @IsInRange(0, 999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 to 999.999.`;
    },
  })
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

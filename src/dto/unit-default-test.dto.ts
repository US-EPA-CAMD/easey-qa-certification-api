import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
} from './unit-default-test-run.dto';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { FuelCode } from '../entities/fuel-code.entity';
import { OperatingConditionCode } from '../entities/operating-condition-code.entity';
import { Type } from 'class-transformer';

const KEY = 'Unit Default Test';

export class UnitDefaultTestBaseDTO {
  @IsOptional()
  @IsString()
  @IsValidCode(FuelCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value] for [fieldname], which is not in the list of valid values for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  fuelCode?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place.`;
      },
    },
  )
  @IsInRange(-999.999, 999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 to 999.999.`;
    },
  })
  noxDefaultRate?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(OperatingConditionCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value] for [fieldname], which is not in the list of valid values for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  operatingConditionCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 10 characters`;
    },
  })
  groupId?: string;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 to 99.`;
    },
  })
  numberOfUnitsInGroup?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 to 99.`;
    },
  })
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
  @ValidateNested({ each: true })
  @Type(() => UnitDefaultTestRunImportDTO)
  unitDefaultTestRunData: UnitDefaultTestRunImportDTO[];
}

export class UnitDefaultTestDTO extends UnitDefaultTestRecordDTO {
  unitDefaultTestRunData: UnitDefaultTestRunDTO[];
}

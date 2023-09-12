import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { TestBasisCode } from '../entities/test-basis-code.entity';
const KEY = 'Fuel Flow To Load Test';

export class FuelFlowToLoadTestBaseDTO {
  @IsOptional()
  @IsString()
  @IsValidCode(TestBasisCode, {
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
  testBasisCode?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999.9 for [${KEY}].`;
    },
  })
  averageDifference?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}].`;
    },
  })
  numberOfHoursUsed?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}].`;
    },
  })
  numberOfHoursExcludedCofiring?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}].`;
    },
  })
  numberOfHoursExcludedRamping?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}].`;
    },
  })
  numberOfHoursExcludedLowRange?: number;
}

export class FuelFlowToLoadTestRecordDTO extends FuelFlowToLoadTestBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FuelFlowToLoadTestImportDTO extends FuelFlowToLoadTestBaseDTO {}

export class FuelFlowToLoadTestDTO extends FuelFlowToLoadTestRecordDTO {}

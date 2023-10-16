import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { TestBasisCode } from '../entities/test-basis-code.entity';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { OperatingLevelCode } from '../entities/workspace/operating-level-code.entity';

const KEY = 'Flow To Load Check';

export class FlowToLoadCheckBaseDTO {
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
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer of 0 and 1 for [${KEY}]`;
    },
  })
  biasAdjustedIndicator?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}]`;
    },
  })
  averageAbsolutePercentDifference?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  numberOfHours?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  numberOfHoursExcludedForFuel?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  numberOfHoursExcludedRamping?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  numberOfHoursExcludedBypass?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  numberOfHoursExcludedPreRATA?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  numberOfHoursExcludedTest?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  numberOfHoursExcludedMainBypass?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(OperatingLevelCode, {
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

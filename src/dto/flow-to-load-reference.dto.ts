import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidationArguments,
} from 'class-validator';
import { OperatingLevelCode } from '../entities/workspace/operating-level-code.entity';
const KEY = 'Flow To Load Reference';

export class FlowToLoadReferenceBaseDTO {
  @IsOptional()
  @IsString()
  @MaxLength(18, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 18 characters`;
    },
  })
  rataTestNumber?: string;

  @IsString()
  @IsValidCode(OperatingLevelCode, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
    },
  })
  operatingLevelCode: string;

  @IsOptional()
  @IsInt()
  @IsInRange(-999999, 999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999 and 999999 for [${KEY}].`;
    },
  })
  averageGrossUnitLoad?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(-9999999999, 9999999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999 and 9999999999 for [${KEY}].`;
    },
  })
  averageReferenceMethodFlow?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.99, 9999.99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.99 and 9999.99 for [${KEY}].`;
    },
  })
  referenceFlowLoadRatio?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-999999.9, 999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999.9 and 999999.9 for [${KEY}].`;
    },
  })
  averageHourlyHeatInputRate?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(-999999, 999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999 and 999999 for [${KEY}].`;
    },
  })
  referenceGrossHeatRate?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 0 or 1 for [${KEY}].`;
    },
  })
  calculatedSeparateReferenceIndicator?: number;
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

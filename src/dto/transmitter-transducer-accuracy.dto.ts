import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { AccuracySpecCode } from '../entities/accuracy-spec-code.entity';

const KEY = 'Transmitter Transducer Accuracy';
export class TransmitterTransducerAccuracyBaseDTO {
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}].`;
    },
  })
  lowLevelAccuracy?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(AccuracySpecCode, {
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
  lowLevelAccuracySpecCode?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}].`;
    },
  })
  midLevelAccuracy?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(AccuracySpecCode, {
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
  midLevelAccuracySpecCode?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}].`;
    },
  })
  highLevelAccuracy?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(AccuracySpecCode, {
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
  highLevelAccuracySpecCode?: string;
}

export class TransmitterTransducerAccuracyRecordDTO extends TransmitterTransducerAccuracyBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class TransmitterTransducerAccuracyImportDTO extends TransmitterTransducerAccuracyBaseDTO {}

export class TransmitterTransducerAccuracyDTO extends TransmitterTransducerAccuracyRecordDTO {}

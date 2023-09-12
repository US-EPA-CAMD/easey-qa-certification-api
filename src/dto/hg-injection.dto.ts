import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsInRange,
  IsIsoFormat,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import {
  MAX_HOUR,
  MAX_MINUTE,
  MIN_HOUR,
  MIN_MINUTE,
} from '../utilities/constants';

const KEY = 'Hg Test Injection';
const DATE_FORMAT = 'YYYY-MM-DD';

export class HgInjectionBaseDTO {
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  injectionDate: Date;

  @IsInt()
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of ${MIN_HOUR} and ${MAX_HOUR} for [${KEY}]`;
    },
  })
  injectionHour: number;

  @IsInt()
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of ${MIN_MINUTE} and ${MAX_MINUTE} for [${KEY}]`;
    },
  })
  injectionMinute: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}].`;
    },
  })
  measuredValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}].`;
    },
  })
  referenceValue?: number;
}

export class HgInjectionRecordDTO extends HgInjectionBaseDTO {
  id: string;
  hgTestSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class HgInjectionImportDTO extends HgInjectionBaseDTO {}

export class HgInjectionDTO extends HgInjectionRecordDTO {}

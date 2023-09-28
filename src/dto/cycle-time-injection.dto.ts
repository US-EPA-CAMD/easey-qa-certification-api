import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, IsValidDate } from '@us-epa-camd/easey-common/pipes';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidationArguments,
  IsOptional,
  IsInt,
} from 'class-validator';
import {
  MAX_HOUR,
  MAX_MINUTE,
  MIN_HOUR,
  MIN_MINUTE,
} from '../utilities/constants';

const KEY = 'Cycle Time Injection';
const DATE_FORMAT = 'YYYY-MM-DD';

export class CycleTimeInjectionBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CYCLE-21-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  gasLevelCode: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}]`;
    },
  })
  calibrationGasValue?: number;

  @IsOptional()
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
  beginDate?: Date;

  @IsOptional()
  @IsInt()
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 23 for [${KEY}]`;
    },
  })
  beginHour?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 59 for [${KEY}]`;
    },
  })
  beginMinute?: number;

  @IsOptional()
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
  endDate?: Date;

  @IsOptional()
  @IsInt()
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 23 for [${KEY}]`;
    },
  })
  endHour?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 59 for [${KEY}]`;
    },
  })
  endMinute?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 99 for [${KEY}]`;
    },
  })
  injectionCycleTime?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
  beginMonitorValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
  endMonitorValue?: number;
}

export class CycleTimeInjectionRecordDTO extends CycleTimeInjectionBaseDTO {
  id: string;
  cycleTimeSumId: string;
  calculatedInjectionCycleTime: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class CycleTimeInjectionImportDTO extends CycleTimeInjectionBaseDTO {}

export class CycleTimeInjectionDTO extends CycleTimeInjectionRecordDTO {}

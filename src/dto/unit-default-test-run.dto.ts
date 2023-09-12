import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  BeginEndDatesConsistent,
  IsInRange,
  IsIsoFormat,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import {
  MAX_HOUR,
  MAX_MINUTE,
  MIN_HOUR,
  MIN_MINUTE,
} from '../utilities/constants';

const DATE_FORMAT = 'YYYY-MM-DD';
const KEY = 'Unit Default Test Run';
export class UnitDefaultTestRunBaseDTO {
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(1, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 1 and 99 for [${KEY}].`;
    },
  })
  operatingLevelForRun: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(1, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 1 and 99 for [${KEY}].`;
    },
  })
  runNumber: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-17-A', {
        key: KEY,
      });
    },
  })
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
  beginDate?: Date;

  @ValidateIf(o => o.beginDate !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-17-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-17-A', {
        key: KEY,
      });
    },
  })
  beginHour?: number;

  @ValidateIf(o => o.beginDate !== null && o.beginHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-17-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-17-A', {
        key: KEY,
      });
    },
  })
  beginMinute?: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-18-A', {
        key: KEY,
      });
    },
  })
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
  endDate?: Date;

  @ValidateIf(o => o.endDate !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-18-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-18-A', {
        key: KEY,
      });
    },
  })
  endHour?: number;

  @ValidateIf(o => o.endDate !== null && o.endHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-18-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-18-A', {
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('UNITDEF-18-B', {
        key: KEY,
      });
    },
  })
  endMinute?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 800, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 800 for [${KEY}].`;
    },
  })
  responseTime?: number;

  @IsOptional()
  @IsNumber()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 99999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 99999.999 for [${KEY}].`;
    },
  })
  referenceValue?: number;

  @IsOptional()
  @IsNumber()
  runUsedIndicator?: number;
}

export class UnitDefaultTestRunRecordDTO extends UnitDefaultTestRunBaseDTO {
  id: string;
  unitDefaultTestSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class UnitDefaultTestRunImportDTO extends UnitDefaultTestRunBaseDTO {}

export class UnitDefaultTestRunDTO extends UnitDefaultTestRunRecordDTO {}

import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { RunStatusCode } from '../entities/run-status-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { FlowRataRunDTO, FlowRataRunImportDTO } from './flow-rata-run.dto';
import {
  IsInRange,
  IsIsoFormat,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import { Type } from 'class-transformer';

const KEY = 'RATA Run';
const MIN_RUN_NUMBER = 1;
const MAX_RUN_NUMBER = 99;
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const MIN_MINUTE = 0;
const MAX_MINUTE = 59;
const DATE_FORMAT = 'YYYY-MM-DD';

export class RataRunBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-113-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_RUN_NUMBER, MAX_RUN_NUMBER, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-113-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_RUN_NUMBER,
        maxvalue: MAX_RUN_NUMBER,
      });
    },
  })
  runNumber: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-30-A', {
        fieldname: args.property,
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}].`;
    },
  })
  beginDate: Date;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-30-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-30-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-30-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-30-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  beginMinute: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-31-A', {
        fieldname: args.property,
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}].`;
    },
  })
  endDate: Date;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-31-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-31-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  endHour: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-31-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-31-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  endMinute: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 5 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 5 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.99999, 9999999999.99999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.99999 and 9999999999.99999 for [${KEY}].`;
    },
  })
  cemValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 5 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 5 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.99999, 9999999999.99999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.99999 and 9999999999.99999 for [${KEY}].`;
    },
  })
  rataReferenceValue?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(-999999, 999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999 and 999999 for [${KEY}].`;
    },
  })
  grossUnitLoad?: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-29-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(RunStatusCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-29-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  runStatusCode: string;
}

export class RataRunRecordDTO extends RataRunBaseDTO {
  id: string;
  rataSumId: string;
  calculatedRataReferenceValue: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataRunImportDTO extends RataRunBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => FlowRataRunImportDTO)
  flowRataRunData: FlowRataRunImportDTO[];
}

export class RataRunDTO extends RataRunRecordDTO {
  flowRataRunData: FlowRataRunDTO[];
}

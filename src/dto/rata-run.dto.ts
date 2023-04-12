import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { RunStatusCode } from '../entities/run-status-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { FlowRataRunDTO, FlowRataRunImportDTO } from './flow-rata-run.dto';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
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

  @IsOptional()
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
  beginDate?: Date;

  @IsOptional()
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
  beginHour?: number;

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

  @IsOptional()
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
  endDate?: Date;

  @IsOptional()
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
  endHour?: number;

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
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-27-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-27-B', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.runStatusCode === 'RUNUSED')
  cemValue?: number;

  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-33-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-33-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.runStatusCode === 'RUNUSED')
  rataReferenceValue?: number;

  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-26-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsPositive({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-26-B', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.runStatusCode === 'RUNUSED')
  grossUnitLoad?: number;

  @IsOptional()
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
  runStatusCode?: string;
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

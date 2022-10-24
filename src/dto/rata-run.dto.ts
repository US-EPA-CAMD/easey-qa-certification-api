import {
  IsNotEmpty,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { RunStatusCode } from '../entities/run-status-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { FlowRataRunDTO, FlowRataRunImportDTO } from './flow-rata-run.dto';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { Type } from 'class-transformer';

const KEY = 'RATA Run';
const MIN_RUN_NUMBER = 1;
const MAX_RUN_NUMBER = 99;

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

  beginDate: Date;
  beginHour: number;
  beginMinute: number;
  endDate: Date;
  endHour: number;
  endMinute: number;
  cemValue: number;

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
  rataReferenceValue: number;

  grossUnitLoad: number;

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
  @ValidateNested({ each: true })
  @Type(() => FlowRataRunDTO)
  flowRataRunData: FlowRataRunDTO[];
}

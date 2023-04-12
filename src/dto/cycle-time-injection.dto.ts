import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidationArguments,
  IsOptional,
} from 'class-validator';

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
  @IsNumber()
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
  beginDate?: Date;
  @IsOptional()
  @IsNumber()
  beginHour?: number;
  @IsNumber()
  beginMinute: number;

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
  endDate?: Date;
  @IsOptional()
  @IsNumber()
  endHour?: number;
  @IsNumber()
  endMinute: number;
  @IsOptional()
  @IsNumber()
  injectionCycleTime?: number;
  @IsOptional()
  @IsNumber()
  beginMonitorValue?: number;
  @IsOptional()
  @IsNumber()
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

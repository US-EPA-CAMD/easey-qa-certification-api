import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { IsNotEmpty, ValidationArguments } from 'class-validator';

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
  gasLevelCode: string;
  calibrationGasValue: number;

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
  beginDate: Date;
  beginHour: number;
  beginMinute: number;

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
  endDate: Date;
  endHour: number;
  endMinute: number;
  injectionCycleTime: number;
  beginMonitorValue: number;
  endMonitorValue: number;
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

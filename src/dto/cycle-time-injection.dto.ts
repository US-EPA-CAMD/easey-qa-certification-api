import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsNotEmpty,
  ValidationArguments,
} from 'class-validator';
import { ArrayContains } from '../pipes/array-contains.pipe';

const KEY = 'Cycle Time Injection';

export class CycleTimeInjectionBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CYCLE-21-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ArrayContains(['ZERO', 'HIGH'], {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CYCLE-21-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  gasLevelCode: string;
  calibrationGasValue: number;
  beginDate: Date;
  beginHour: number;
  beginMinute: number;
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

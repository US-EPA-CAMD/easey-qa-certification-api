import { ValidationArguments } from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { RunStatusCode } from '../entities/run-status-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { FlowRataRunDTO, FlowRataRunImportDTO } from './flow-rata-run.dto';

const KEY = 'RATA Run';

export class RataRunBaseDTO {
  runNumber: number;
  beginDate: Date;
  beginHour: number;
  beginMinute: number;
  endDate: Date;
  endHour: number;
  endMinute: number;
  cemValue: number;
  rataReferenceValue: number;
  grossUnitLoad: number;
  @IsValidCode(RunStatusCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value], which is not in the list of valid values, in the field [fieldname] for [key]',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
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
  flowRataRunData: FlowRataRunImportDTO[];
}

export class RataRunDTO extends RataRunRecordDTO {
  flowRataRunData: FlowRataRunDTO[];
}

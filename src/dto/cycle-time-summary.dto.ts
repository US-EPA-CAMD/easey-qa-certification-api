import { Type } from 'class-transformer';
import {ValidateNested, IsNumber, IsOptional, IsInt, ValidationArguments} from 'class-validator';
import {
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
} from './cycle-time-injection.dto';
import {IsInRange} from "@us-epa-camd/easey-common/pipes";
import {CheckCatalogService} from "@us-epa-camd/easey-common/check-catalog";

const KEY = 'Cycle Time Summary';
const TOTAL_TIME_VALID_MSG = (args: ValidationArguments) => {
  return CheckCatalogService.formatMessage(
      'The value [value] in the field [fieldname] for [key] is invalid. ' +
      'This value must be an integer from 0 to 99',
      {
        fieldname: args.property,
        value: args.value,
        key: KEY,
      },
  );
}

export class CycleTimeSummaryBaseDTO {

  @IsOptional()
  @IsInt({
    message: TOTAL_TIME_VALID_MSG,
  })
  @IsInRange(0, 99, {
        message: TOTAL_TIME_VALID_MSG,
      }
  )
  totalTime?: number;
}

export class CycleTimeSummaryRecordDTO extends CycleTimeSummaryBaseDTO {
  id: string;
  testSumId: string;
  calculatedTotalTime: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class CycleTimeSummaryImportDTO extends CycleTimeSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => CycleTimeInjectionImportDTO)
  cycleTimeInjectionData: CycleTimeInjectionImportDTO[];
}

export class CycleTimeSummaryDTO extends CycleTimeSummaryRecordDTO {
  cycleTimeInjectionData: CycleTimeInjectionDTO[];
}
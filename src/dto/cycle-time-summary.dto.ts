import { Type } from 'class-transformer';
import { ValidateNested, IsNumber } from 'class-validator';
import {
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
} from './cycle-time-injection.dto';

const KEY = 'Cycle Time Summary';
export class CycleTimeSummaryBaseDTO {
  @IsNumber()
  totalTime: number;
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

import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { HgInjectionDTO, HgInjectionImportDTO } from './hg-injection.dto';

export class HgSummaryBaseDTO {
  gasLevelCode: string;
  meanMeasuredValue: number;
  meanReferenceValue: number;
  percentError: number;
  apsIndicator: number;
}

export class HgSummaryRecordDTO extends HgSummaryBaseDTO {
  id: string;
  testSumId: string;
  calculatedMeanMeasuredValue: number;
  calculatedMeanReferenceValue: number;
  calculatedPercentError: number;
  calculatedAPSIndicator: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class HgSummaryImportDTO extends HgSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => HgInjectionImportDTO)
  HgInjectionData: HgInjectionImportDTO[];
}

export class HgSummaryDTO extends HgSummaryRecordDTO {
  HgInjectionData: HgInjectionDTO[];
}

import { IsNumber, IsString } from 'class-validator';
import { HgInjectionDTO, HgInjectionImportDTO } from './hg-injection.dto';

const KEY = 'Hg Test Summary';

export class HgSummaryBaseDTO {
  @IsString()
  gasLevelCode: string;
  @IsNumber()
  meanMeasuredValue: number;
  @IsNumber()
  meanReferenceValue: number;
  @IsNumber()
  percentError: number;
  @IsNumber()
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
  HgInjectionData: HgInjectionImportDTO[];
}

export class HgSummaryDTO extends HgSummaryRecordDTO {
  HgInjectionData: HgInjectionDTO[];
}

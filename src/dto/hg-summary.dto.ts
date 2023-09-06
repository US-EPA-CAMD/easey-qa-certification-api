import { IsNumber, IsOptional, IsString } from 'class-validator';
import { HgInjectionDTO, HgInjectionImportDTO } from './hg-injection.dto';

const KEY = 'Hg Test Summary';

export class HgSummaryBaseDTO {
  @IsString()
  gasLevelCode: string;
  @IsOptional()
  @IsNumber()
  meanMeasuredValue?: number;
  @IsOptional()
  @IsNumber()
  meanReferenceValue?: number;
  @IsOptional()
  @IsNumber()
  percentError?: number;
  @IsOptional()
  @IsNumber()
  apsIndicator?: number;
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
  hgInjectionData: HgInjectionImportDTO[];
}

export class HgSummaryDTO extends HgSummaryRecordDTO {
  hgInjectionData: HgInjectionDTO[];
}

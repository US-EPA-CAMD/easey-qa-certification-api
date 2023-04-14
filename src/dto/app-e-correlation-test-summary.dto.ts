import { Type } from 'class-transformer';
import { ValidateNested, IsNumber, IsOptional } from 'class-validator';
import {
  AppECorrelationTestRunDTO,
  AppECorrelationTestRunImportDTO,
} from './app-e-correlation-test-run.dto';

const KEY = 'Appendix E Correlation Test Summary';

export class AppECorrelationTestSummaryBaseDTO {
  @IsNumber()
  operatingLevelForRun: number;
  @IsOptional()
  @IsNumber()
  meanReferenceValue?: number;
  @IsOptional()
  @IsNumber()
  averageHourlyHeatInputRate?: number;
  @IsOptional()
  @IsNumber()
  fFactor?: number;
}

export class AppECorrelationTestSummaryRecordDTO extends AppECorrelationTestSummaryBaseDTO {
  id: string;
  testSumId: string;
  calculatedMeanReferenceValue: number;
  calculatedAverageHourlyHeatInputRate: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppECorrelationTestSummaryImportDTO extends AppECorrelationTestSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => AppECorrelationTestRunImportDTO)
  appECorrelationTestRunData: AppECorrelationTestRunImportDTO[];
}

export class AppECorrelationTestSummaryDTO extends AppECorrelationTestSummaryRecordDTO {
  appECorrelationTestRunData: AppECorrelationTestRunDTO[];
}

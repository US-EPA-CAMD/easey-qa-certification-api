import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  AppECorrelationTestRunDTO,
  AppECorrelationTestRunImportDTO,
} from './app-e-correlation-test-run.dto';

const KEY = 'Appendix E Correlation Test Summary';

export class AppECorrelationTestSummaryBaseDTO {
  operatingLevelForRun: number;
  meanReferenceValue: number;
  averageHourlyHeatInputRate: number;
  fFactor: number;
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

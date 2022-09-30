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
  appECorrelationTestRunData: [];
}
export class AppECorrelationTestSummaryDTO extends AppECorrelationTestSummaryRecordDTO {
  appECorrelationTestRunData: [];
}

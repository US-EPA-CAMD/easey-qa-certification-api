const KEY = 'Appendix E Test Summary';

export class AppECorrelationTestSummaryBaseDTO {
    operatingLevelForRun: number;
    meanReferenceValue: number;
    calculatedMeanReferenceValue: number;
    averageHourlyHeatInputRate: number;
    fFactor: number;
    calculatedAverageHourlyHeatInputRate: number;
    
}

export class AppECorrelationTestSummaryRecordDTO extends AppECorrelationTestSummaryBaseDTO {
    id: string;
    testSumId: string;
    userId: string;
    addDate: string;
    updateDate: string;
}

export class AppECorrelationTestSummaryImportDTO extends AppECorrelationTestSummaryBaseDTO {}

export class AppECorrelationTestSummaryDTO extends AppECorrelationTestSummaryRecordDTO {}

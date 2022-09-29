const KEY = 'Appendix E Correlation Test Run';

export class AppECorrelationTestRunBaseDTO {
  runNumber: number;
  referenceValue: number;
  hourlyHeatInputRate: number;
  totalHeatInput: number;
  responseTime: number;
  beginDate: Date;
  beginHour: number;
  beginMinute: number;
  endDate: Date;
  endHour: number;
  endMinute: number;
}

export class AppECorrelationTestRunRecordDTO extends AppECorrelationTestRunBaseDTO {
  id: string;
  appECorrTestSumId: string;
  calculatedHourlyHeatInputRate: number;
  calculatedTotalHeatInput: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppECorrelationTestRunImportDTO extends AppECorrelationTestRunBaseDTO {
  appECorrelationHeatInputFromOilData: [];
  appECorrelationHeatInputFromGasData: [];
}

export class AppECorrelationTestRunDTO extends AppECorrelationTestRunRecordDTO {
  appECorrelationHeatInputFromOilData: [];
  appECorrelationHeatInputFromGasData: [];
}

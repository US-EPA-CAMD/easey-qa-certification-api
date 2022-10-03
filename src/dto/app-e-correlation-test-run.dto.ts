import {
  AppECorrelationHeatInputFromOilDTO,
  AppECorrelationHeatInputFromOilImportDTO,
} from './app-e-correlation-heat-input-from-oil.dto';
import {
  AppECorrelationHeatInputFromGasDTO,
  AppECorrelationHeatInputFromGasImportDTO,
} from './app-e-correlation-heat-input-from-gas.dto';

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
  appECorrelationHeatInputFromOilData: AppECorrelationHeatInputFromOilImportDTO[];
  appECorrelationHeatInputFromGasData: AppECorrelationHeatInputFromGasImportDTO[];
}

export class AppECorrelationTestRunDTO extends AppECorrelationTestRunRecordDTO {
  appECorrelationHeatInputFromOilData: AppECorrelationHeatInputFromOilDTO[];
  appECorrelationHeatInputFromGasData: AppECorrelationHeatInputFromGasDTO[];
}

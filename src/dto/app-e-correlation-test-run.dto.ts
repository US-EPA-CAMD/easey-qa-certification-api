import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
} from './app-e-heat-input-from-oil.dto';
import {
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasImportDTO,
} from './app-e-heat-input-from-gas.dto';

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
  appEHeatInputFromOilData: AppEHeatInputFromOilImportDTO[];
  appEHeatInputFromGasData: AppEHeatInputFromGasImportDTO[];
}

export class AppECorrelationTestRunDTO extends AppECorrelationTestRunRecordDTO {
  appEHeatInputFromOilData: AppEHeatInputFromOilDTO[];
  appEHeatInputFromGasData: AppEHeatInputFromGasDTO[];
}

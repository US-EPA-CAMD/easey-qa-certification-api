import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
} from './app-e-heat-input-from-oil.dto';
import {
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasImportDTO,
} from './app-e-heat-input-from-gas.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
  @ValidateNested({ each: true })
  @Type(() => AppEHeatInputFromOilImportDTO)
  appEHeatInputFromOilData: AppEHeatInputFromOilImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => AppEHeatInputFromGasImportDTO)
  appEHeatInputFromGasData: AppEHeatInputFromGasImportDTO[];
}

export class AppECorrelationTestRunDTO extends AppECorrelationTestRunRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => AppEHeatInputFromOilDTO)
  appEHeatInputFromOilData: AppEHeatInputFromOilDTO[];

  @ValidateNested({ each: true })
  @Type(() => AppEHeatInputFromGasDTO)
  appEHeatInputFromGasData: AppEHeatInputFromGasDTO[];
}

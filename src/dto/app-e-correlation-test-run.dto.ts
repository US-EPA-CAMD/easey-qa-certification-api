import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
} from './app-e-heat-input-from-oil.dto';
import {
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasImportDTO,
} from './app-e-heat-input-from-gas.dto';
import { ValidateNested, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';

const KEY = 'Appendix E Correlation Test Run';
const DATE_FORMAT = 'YYYY-MM-DD';

export class AppECorrelationTestRunBaseDTO {
  runNumber: number;
  referenceValue: number;
  hourlyHeatInputRate: number;
  totalHeatInput: number;
  responseTime: number;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT} for [${KEY}].`;
    },
  })
  beginDate: Date;
  beginHour: number;
  beginMinute: number;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT} for [${KEY}].`;
    },
  })
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
  appEHeatInputFromOilData: AppEHeatInputFromOilDTO[];
  appEHeatInputFromGasData: AppEHeatInputFromGasDTO[];
}

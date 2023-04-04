import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
} from './app-e-heat-input-from-oil.dto';
import {
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasImportDTO,
} from './app-e-heat-input-from-gas.dto';
import { IsNumber, IsString, ValidateNested, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

const KEY = 'Appendix E Correlation Test Run';
const DATE_FORMAT = 'YYYY-MM-DD';

export class AppECorrelationTestRunBaseDTO {
  @IsInRange(null, 99, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldname] in [key] must not exceed 2 digits.`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  runNumber: number;
  @IsNumber()
  referenceValue: number;
  @IsNumber()
  hourlyHeatInputRate: number;
  @IsNumber()
  totalHeatInput: number;
  @IsNumber()
  responseTime: number;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  beginDate: Date;
  @IsNumber()
  beginHour: number;
  @IsNumber()
  beginMinute: number;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  endDate: Date;
  @IsNumber()
  endHour: number;
  @IsNumber()
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

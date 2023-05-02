import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
} from './app-e-heat-input-from-oil.dto';
import {
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasImportDTO,
} from './app-e-heat-input-from-gas.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  BeginEndDatesConsistent,
  IsInRange,
} from '@us-epa-camd/easey-common/pipes';
import {
  MAX_HOUR,
  MAX_MINUTE,
  MIN_HOUR,
  MIN_MINUTE,
} from '../utilities/constants';

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

  @IsOptional()
  @IsNumber()
  referenceValue?: number;

  @IsOptional()
  @IsNumber()
  hourlyHeatInputRate?: number;

  @IsOptional()
  @IsNumber()
  totalHeatInput?: number;

  @IsOptional()
  @IsNumber()
  responseTime?: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-19-A', {
        key: KEY,
      });
    },
  })
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

  @ValidateIf(o => o.beginDate !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-19-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-19-A', {
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ValidateIf(o => o.beginDate !== null && o.beginHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-19-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-19-A', {
        key: KEY,
      });
    },
  })
  beginMinute: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-20-A', {
        key: KEY,
      });
    },
  })
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

  @ValidateIf(o => o.endDate !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-20-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-20-A', {
        key: KEY,
      });
    },
  })
  endHour: number;

  @ValidateIf(o => o.endDate !== null && o.endHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-20-A', {
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-20-A', {
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-20-B', {
        key: KEY,
      });
    },
  })
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

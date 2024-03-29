import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsNumber,
  IsOptional,
  IsInt,
  ValidationArguments,
  IsNotEmpty,
} from 'class-validator';
import {
  AppECorrelationTestRunDTO,
  AppECorrelationTestRunImportDTO,
} from './app-e-correlation-test-run.dto';
import { IsInRange } from '@us-epa-camd/easey-common/pipes/is-in-range.pipe';

const KEY = 'Appendix E Correlation Test Summary';

export class AppECorrelationTestSummaryBaseDTO {
  @IsInt()
  @IsNotEmpty()
  @IsInRange(0, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 99 for [${KEY}].`;
    },
  })
  operatingLevelForRun: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-99999.999, 99999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -99999.999 and 99999.999 for [${KEY}].`;
    },
  })
  meanReferenceValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-999999.9, 999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999.9 and 999999.9 for [${KEY}].`;
    },
  })
  averageHourlyHeatInputRate?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-999999999.9, 999999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999999.9 and 999999999.9 for [${KEY}].`;
    },
  })
  fFactor?: number;
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
  appendixECorrelationTestRunData: AppECorrelationTestRunImportDTO[];
}

export class AppECorrelationTestSummaryDTO extends AppECorrelationTestSummaryRecordDTO {
  appendixECorrelationTestRunData: AppECorrelationTestRunDTO[];
}

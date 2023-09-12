import { Type } from 'class-transformer';
import { ValidateNested, IsNumber, IsOptional, IsInt, IsInRange, ValidationArguments } from 'class-validator';
import {
  AppECorrelationTestRunDTO,
  AppECorrelationTestRunImportDTO,
} from './app-e-correlation-test-run.dto';

const KEY = 'Appendix E Correlation Test Summary';

export class AppECorrelationTestSummaryBaseDTO {
  @IsNumber()
  @IsInRange(1, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 1 and 99 for [${KEY}].`;
    },
  })
  operatingLevelForRun: number;
  
  @IsOptional()
  @IsNumber()
  @IsInRange(0, 3, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 3 for [${KEY}].`;
    },
  })
  meanReferenceValue?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999999.9 for [${KEY}].`;
    },
  })
  averageHourlyHeatInputRate?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(1000, 22000, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 1000 and 22000 for [${KEY}].`;
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

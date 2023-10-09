import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { HgInjectionDTO, HgInjectionImportDTO } from './hg-injection.dto';
import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { GasLevelCode } from '../entities/workspace/gas-level-code.entity';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Type } from 'class-transformer';

const KEY = 'Hg Test Summary';

export class HgSummaryBaseDTO {
  @IsString()
  @IsValidCode(GasLevelCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value] for [fieldname], which is not in the list of valid values for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  gasLevelCode: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}].`;
    },
  })
  meanMeasuredValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}].`;
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
  @IsInRange(0, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999.9 for [${KEY}].`;
    },
  })
  percentError?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 0 or 1 for [${KEY}]`;
    },
  })
  apsIndicator?: number;
}

export class HgSummaryRecordDTO extends HgSummaryBaseDTO {
  id: string;
  testSumId: string;
  calculatedMeanMeasuredValue: number;
  calculatedMeanReferenceValue: number;
  calculatedPercentError: number;
  calculatedAPSIndicator: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class HgSummaryImportDTO extends HgSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => HgInjectionImportDTO)
  hgInjectionData: HgInjectionImportDTO[];
}

export class HgSummaryDTO extends HgSummaryRecordDTO {
  hgInjectionData: HgInjectionDTO[];
}

import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, MatchesRegEx } from '@us-epa-camd/easey-common/pipes';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';

const KEY = 'Appendix E Heat Input From Gas';

export class AppEHeatInputFromGasBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-45-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 3 characters and only consist of upper case letters and numbers.`;
    },
  })
  @IsString()
  monitoringSystemId: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 6 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 6 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0.0 and 999999999.9 for [${KEY}].`;
    },
  })
  gasGCV?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999999999.9 for [${KEY}].`;
    },
  })
  gasVolume?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999999.9 for [${KEY}].`;
    },
  })
  gasHeatInput?: number;
}

export class AppEHeatInputFromGasRecordDTO extends AppEHeatInputFromGasBaseDTO {
  id: string;
  appECorrTestRunId: string;
  calculatedGasHeatInput: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppEHeatInputFromGasImportDTO extends AppEHeatInputFromGasBaseDTO {}

export class AppEHeatInputFromGasDTO extends AppEHeatInputFromGasRecordDTO {}

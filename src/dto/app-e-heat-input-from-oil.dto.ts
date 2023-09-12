import { IsNumber, IsOptional, IsString, MatchesRegEx, ValidationArguments, IsInRange } from 'class-validator';
const KEY = 'Appendix E Heat Input From Oil';

export class AppEHeatInputFromOilBaseDTO {
  @IsString()
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 3 characters and only consist of upper case letters and numbers.`;
    },
  })
  monitoringSystemId: string;
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
  oilMass?: number;

  @IsOptional()
  @IsNumber(
  { maxDecimalPlaces: 6 },
  {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] is allowed only 6 decimal place for $[${KEY}].`;
    },
  },
  )
  @IsInRange(0.000000, 20000.000000, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0.000000 and 20000.000000 for [${KEY}].`;
    },
  })
  oilGCV?: number;

  @IsOptional()
  @IsString()
  oilGCVUnitsOfMeasureCode?: string;
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
  oilHeatInput?: number;

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
  oilVolume?: number;

  @IsOptional()
  @IsString()
  oilVolumeUnitsOfMeasureCode?: string;
  @IsOptional()
    @IsNumber(
    { maxDecimalPlaces: 6 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0.000000, 20000.000000, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0.000000 and 999999999.9 for [${KEY}].`;
    },
  })
  oilDensity?: number;
  @IsOptional()
  @IsString()
  oilDensityUnitsOfMeasureCode?: string;
}

export class AppEHeatInputFromOilRecordDTO extends AppEHeatInputFromOilBaseDTO {
  id: string;
  appECorrTestRunId: string;
  calculatedOilMass: number;
  calculatedOilHeatInput: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppEHeatInputFromOilImportDTO extends AppEHeatInputFromOilBaseDTO {}

export class AppEHeatInputFromOilDTO extends AppEHeatInputFromOilRecordDTO {}

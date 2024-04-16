import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsInRange,
  IsValidCode,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { FindOneOptions } from 'typeorm';

import { UnitsOfMeasureCode } from '../entities/units-of-measure-code.entity';

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
  @IsInRange(-999999999.9, 999999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999999.9 and 999999999.9 for [${KEY}].`;
    },
  })
  oilMass?: number;

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
  oilGCV?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(
    UnitsOfMeasureCode,
    {
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
    },
    (args: ValidationArguments): FindOneOptions<UnitsOfMeasureCode> => {
      return { where: { unitsOfMeasureCode: args.value } };
    },
  )
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
  @IsInRange(-999999.9, 999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999.9 and 999999.9 for [${KEY}].`;
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
  @IsInRange(-999999999.9, 999999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -999999999.9 and 999999999.9 for [${KEY}].`;
    },
  })
  oilVolume?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(
    UnitsOfMeasureCode,
    {
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
    },
    (args: ValidationArguments): FindOneOptions<UnitsOfMeasureCode> => {
      return { where: { unitsOfMeasureCode: args.value } };
    },
  )
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
  @IsInRange(-99999.999999, 99999.999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -99999.999999 and 99999.999999 for [${KEY}].`;
    },
  })
  oilDensity?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(
    UnitsOfMeasureCode,
    {
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
    },
    (args: ValidationArguments): FindOneOptions<UnitsOfMeasureCode> => {
      return { where: { unitsOfMeasureCode: args.value } };
    },
  )
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

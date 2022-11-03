import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, Min } from '@us-epa-camd/easey-common/pipes';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { IsNotZero } from '../pipes/is-not-zero.pipe';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';
import { RataTraverseDTO, RataTraverseImportDTO } from './rata-traverse.dto';

const KEY = 'Flow RATA Run';
const MIN_STATIC_STACK_PRESSURE = -30;
const MAX_STATIC_STACK_PRESSURE = 30;
const MIN_BAROMETRIC_PRESSURE = 20;
const MAX_BAROMETRIC_PRESSURE = 35;
const MIN_PERCENT_CO2_PRESSURE = 0;
const MAX_PERCENT_CO2_PRESSURE = 20;
const MIN_PERCENT_O2_PRESSURE = 0;
const MAX_PERCENT_O2_PRESSURE = 22;
const MIN_PERCENT_MOISTURE = 0;
const MAX_PERCENT_MOISTURE = 75.0;
const MIN_WET_MOLECULAR_WEIGHT = 25;
const MAX_WET_MOLECULAR_WEIGHT = 35;
const MIN_NO_OF_TRAVERSE_POINTS = 12;

export class FlowRataRunBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-85-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @Min(MIN_NO_OF_TRAVERSE_POINTS, {
    message: () => {
      return CheckCatalogService.formatResultMessage('RATA-85-B', {
        key: KEY,
      });
    },
  })
  numberOfTraversePoints: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-63-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_BAROMETRIC_PRESSURE, MAX_BAROMETRIC_PRESSURE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-63-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_BAROMETRIC_PRESSURE,
        maxvalue: MAX_BAROMETRIC_PRESSURE,
      });
    },
  })
  barometricPressure: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-64-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_STATIC_STACK_PRESSURE, MAX_STATIC_STACK_PRESSURE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-64-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_STATIC_STACK_PRESSURE,
        maxvalue: MAX_STATIC_STACK_PRESSURE,
      });
    },
  })
  staticStackPressure: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-65-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    MIN_PERCENT_CO2_PRESSURE,
    MAX_PERCENT_CO2_PRESSURE,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-65-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
          minvalue: MIN_PERCENT_CO2_PRESSURE,
          maxvalue: MAX_PERCENT_CO2_PRESSURE,
        });
      },
    },
    false,
    false,
  )
  percentCO2: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-66-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    MIN_PERCENT_O2_PRESSURE,
    MAX_PERCENT_O2_PRESSURE,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-66-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
          minvalue: MIN_PERCENT_O2_PRESSURE,
          maxvalue: MAX_PERCENT_O2_PRESSURE,
        });
      },
    },
    false,
    false,
  )
  percentO2: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-67-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    MIN_PERCENT_MOISTURE,
    MAX_PERCENT_MOISTURE,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-67-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
          minvalue: MIN_PERCENT_MOISTURE,
          maxvalue: MAX_PERCENT_MOISTURE,
        });
      },
    },
    false,
    false,
  )
  percentMoisture: number;

  dryMolecularWeight: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-69-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_WET_MOLECULAR_WEIGHT, MAX_WET_MOLECULAR_WEIGHT, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-69-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_WET_MOLECULAR_WEIGHT,
        maxvalue: MAX_WET_MOLECULAR_WEIGHT,
      });
    },
  })
  wetMolecularWeight: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-115-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  averageVelocityWithoutWallEffects: number;

  averageVelocityWithWallEffects: number;
  calculatedWAF: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-94-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-94-B', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotZero({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-94-B', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  averageStackFlowRate: number;
}

export class FlowRataRunRecordDTO extends FlowRataRunBaseDTO {
  id: string;
  rataRunId: string;
  calculatedDryMolecularWeight: number;
  calculatedWetMolecularWeight: number;
  calculatedAverageVelocityWithoutWallEffects: number;
  calculatedAverageVelocityWithWallEffects: number;
  calculatedCalculatedWAF: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
}

export class FlowRataRunImportDTO extends FlowRataRunBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => RataTraverseImportDTO)
  rataTraverseData: RataTraverseImportDTO[];
}

export class FlowRataRunDTO extends FlowRataRunRecordDTO {
  rataTraverseData: RataTraverseDTO[];
}

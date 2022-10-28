import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { RataTraverseDTO, RataTraverseImportDTO } from './rata-traverse.dto';

const KEY = 'Flow RATA Run';
const MIN_STATIC_STACK_PRESSURE = -30;
const MAX_STATIC_STACK_PRESSURE = 30;
const MIN_BAROMETRIC_PRESSURE = 20;
const MAX_BAROMETRIC_PRESSURE = 35;
const MIN_PERCENT_CO2_PRESSURE = 0.1;
const MAX_PERCENT_CO2_PRESSURE = 20;
const MIN_PERCENT_O2_PRESSURE = 0.1;
const MAX_PERCENT_O2_PRESSURE = 22;

export class FlowRataRunBaseDTO {
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
      console.log('args.value', typeof args.value);
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
  @IsInRange(MIN_PERCENT_CO2_PRESSURE, MAX_PERCENT_CO2_PRESSURE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-65-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_PERCENT_CO2_PRESSURE,
        maxvalue: MAX_PERCENT_CO2_PRESSURE,
      });
    },
  })
  percentCO2: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-66-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_PERCENT_O2_PRESSURE, MAX_PERCENT_O2_PRESSURE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-66-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_PERCENT_O2_PRESSURE,
        maxvalue: MAX_PERCENT_O2_PRESSURE,
      });
    },
  })
  percentO2: number;

  percentMoisture: number;
  dryMolecularWeight: number;
  wetMolecularWeight: number;
  averageVelocityWithoutWallEffects: number;
  averageVelocityWithWallEffects: number;
  calculatedWAF: number;
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

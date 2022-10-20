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

export class FlowRataRunBaseDTO {
  numberOfTraversePoints: number;
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
  percentCO2: number;
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
  @ValidateNested({ each: true })
  @Type(() => RataTraverseDTO)
  rataTraverseData: RataTraverseDTO[];
}

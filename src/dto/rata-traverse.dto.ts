import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { PressureMeasureCode } from '../entities/workspace/pressure-measure-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';

const KEY = 'RATA Traverse';
const MIN_VEL_CAL_COEFF = 0.5;
const MAX_VEL_CAL_COEFF = 1.5;

export class RataTraverseBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-71-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  probeID: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-72-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  probeTypeCode: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-73-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(PressureMeasureCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-73-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  pressureMeasureCode: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-70-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  methodTraversePointID: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-74-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    MIN_VEL_CAL_COEFF,
    MAX_VEL_CAL_COEFF,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-74-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
          minvalue: MIN_VEL_CAL_COEFF,
          maxvalue: MAX_VEL_CAL_COEFF,
        });
      },
    },
    true,
    true,
  )
  velocityCalibrationCoefficient: number;

  lastProbeDate: Date;
  avgVelDiffPressure: number;
  avgSquareVelDiffPressure: number;
  tStackTemperature: number;
  pointUsedIndicator: number;
  numberWallEffectsPoints: number;
  yawAngle: number;
  pitchAngle: number;
  calculatedVelocity: number;
  replacementVelocity: number;
}

export class RataTraverseRecordDTO extends RataTraverseBaseDTO {
  id: string;
  flowRataRunId: string;
  calculatedCalculatedVelocity: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataTraverseImportDTO extends RataTraverseBaseDTO {}

export class RataTraverseDTO extends RataTraverseRecordDTO {}

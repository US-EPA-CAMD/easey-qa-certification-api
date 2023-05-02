import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  ValidationArguments,
  IsString,
  IsOptional,
} from 'class-validator';
import { PressureMeasureCode } from '../entities/workspace/pressure-measure-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';

const KEY = 'RATA Traverse';
const MIN_VEL_CAL_COEFF = 0.5;
const MAX_VEL_CAL_COEFF = 1.5;
const MIN_TSTACK_TEMP = 0;
const MAX_TSTACK_TEMP = 1000;

export class RataTraverseBaseDTO {
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-71-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  probeID?: string;

  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-72-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  probeTypeCode?: string;

  @IsOptional()
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
  pressureMeasureCode?: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-70-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  methodTraversePointID: string;

  @IsOptional()
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
  velocityCalibrationCoefficient?: number;

  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-75-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsDateString()
  lastProbeDate?: Date;

  @IsOptional()
  @IsNumber()
  avgVelDiffPressure?: number;
  @IsOptional()
  @IsNumber()
  avgSquareVelDiffPressure?: number;

  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-77-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    MIN_TSTACK_TEMP,
    MAX_TSTACK_TEMP,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-77-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
          minvalue: MIN_TSTACK_TEMP,
          maxvalue: MAX_TSTACK_TEMP,
        });
      },
    },
    true,
    true,
  )
  tStackTemperature?: number;
  @IsOptional()
  @IsNumber()
  pointUsedIndicator?: number;
  @IsOptional()
  @IsNumber()
  numberWallEffectsPoints?: number;
  @IsOptional()
  @IsNumber()
  yawAngle?: number;
  @IsOptional()
  @IsNumber()
  pitchAngle?: number;
  @IsOptional()
  @IsNumber()
  calculatedVelocity?: number;
  @IsOptional()
  @IsNumber()
  replacementVelocity?: number;
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

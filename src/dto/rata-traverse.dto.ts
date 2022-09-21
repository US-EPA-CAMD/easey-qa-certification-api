const KEY = 'RATA Traverse';
export class RataTraverseBaseDTO {
  probeId: string;
  probeTypeCode: string;
  pressureMeasureCode: string;
  methodTraversePointId: string;
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

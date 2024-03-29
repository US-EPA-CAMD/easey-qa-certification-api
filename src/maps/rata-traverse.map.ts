import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { RataTraverseDTO } from '../dto/rata-traverse.dto';
import { RataTraverse } from '../entities/rata-traverse.entity';

@Injectable()
export class RataTraverseMap extends BaseMap<RataTraverse, RataTraverseDTO> {
  public async one(entity: RataTraverse): Promise<RataTraverseDTO> {
    return {
      id: entity.id,
      flowRataRunId: entity.flowRataRunId,
      probeId: entity.probeId,
      probeTypeCode: entity.probeTypeCode,
      pressureMeasureCode: entity.pressureMeasureCode,
      methodTraversePointId: entity.methodTraversePointId,
      velocityCalibrationCoefficient: entity.velocityCalibrationCoefficient,
      lastProbeDate: entity.lastProbeDate,
      averageVelocityDifferencePressure: entity.averageVelocityDifferencePressure,
      averageSquareVelocityDifferencePressure: entity.averageSquareVelocityDifferencePressure,
      tStackTemperature: entity.tStackTemperature,
      pointUsedIndicator: entity.pointUsedIndicator,
      numberWallEffectsPoints: entity.numberWallEffectsPoints,
      yawAngle: entity.yawAngle,
      pitchAngle: entity.pitchAngle,
      calculatedVelocity: entity.calculatedVelocity,
      replacementVelocity: entity.replacementVelocity,
      calculatedCalculatedVelocity: entity.calculatedCalculatedVelocity,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

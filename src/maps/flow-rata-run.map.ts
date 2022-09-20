import { Injectable } from '@nestjs/common';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { FlowRataRun } from '../entities/flow-rata-run.entity';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

@Injectable()
export class FlowRataRunMap extends BaseMap<FlowRataRun, FlowRataRunDTO> {
  public async one(entity: FlowRataRun): Promise<FlowRataRunDTO> {
    return {
      id: entity.id,
      rataRunId: entity.rataRunId,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      numberOfTraversePoints: entity.numberOfTraversePoints,
      barometricPressure: entity.barometricPressure,
      staticStackPressure: entity.staticStackPressure,
      percentCO2: entity.percentCO2,
      percentO2: entity.percentO2,
      percentMoisture: entity.percentMoisture,
      dryMolecularWeight: entity.dryMolecularWeight,
      calculatedDryMolecularWeight: entity.calculatedDryMolecularWeight,
      wetMolecularWeight: entity.wetMolecularWeight,
      calculatedWetMolecularWeight: entity.calculatedWetMolecularWeight,
      averageVelocityWithoutWallEffects: entity.averageVelocityWithoutWallEffects,
      calculatedAverageVelocityWithoutWallEffects: entity.calculatedAverageVelocityWithoutWallEffects,
      averageVelocityWithWallEffects: entity.averageVelocityWithWallEffects,
      calculatedAverageVelocityWithWallEffects: entity.calculatedAverageVelocityWithWallEffects,
      calculatedWAF: entity.calculatedWAF,
      calculatedCalculatedWAF: entity.calculatedCalculatedWAF,
      averageStackFlowRate: entity.averageStackFlowRate,
      rataTraverseData: [],
    };
  }
}
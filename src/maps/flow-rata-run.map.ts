import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { FlowRataRun } from '../entities/flow-rata-run.entity';
import { RataTraverseMap } from './rata-traverse.map';

@Injectable()
export class FlowRataRunMap extends BaseMap<FlowRataRun, FlowRataRunDTO> {
  constructor(private readonly rataTraverseMap: RataTraverseMap) {
    super();
  }

  public async one(entity: FlowRataRun): Promise<FlowRataRunDTO> {
    const rataTraverseData = entity.RataTraverses
      ? await this.rataTraverseMap.many(entity.RataTraverses)
      : [];

    return {
      id: entity.id,
      rataRunId: entity.rataRunId,
      userId: entity.userId,
      addDate: entity.addDate?.toLocaleString() ?? null,
      updateDate: entity.updateDate?.toLocaleString() ?? null,
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
      averageVelocityWithoutWallEffects:
        entity.averageVelocityWithoutWallEffects,
      calculatedAverageVelocityWithoutWallEffects:
        entity.calculatedAverageVelocityWithoutWallEffects,
      averageVelocityWithWallEffects: entity.averageVelocityWithWallEffects,
      calculatedAverageVelocityWithWallEffects:
        entity.calculatedAverageVelocityWithWallEffects,
      calculatedWAF: entity.calculatedWAF,
      calculatedCalculatedWAF: entity.calculatedCalculatedWAF,
      averageStackFlowRate: entity.averageStackFlowRate,
      rataTraverseData,
    };
  }
}

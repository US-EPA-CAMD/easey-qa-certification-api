import { RataTraverseDTO, RataTraverseImportDTO } from './rata-traverse.dto';

const KEY = 'Flow RATA Run';

export class FlowRataRunBaseDTO {
  numberOfTraversePoints: number;
  barometricPressure: number;
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
  rataTraverseData: RataTraverseImportDTO[];
}

export class FlowRataRunDTO extends FlowRataRunRecordDTO {
  rataTraverseData: RataTraverseDTO[];
}

import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { RataDTO } from '../dto/rata.dto';
import { Rata } from '../entities/rata.entity';

@Injectable()
export class RataMap extends BaseMap<Rata, RataDTO> {
  public async one(entity: Rata): Promise<RataDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      rataFrequencyCode: entity.rataFrequencyCode,
      calculatedRataFrequencyCode: entity.calculatedRataFrequencyCode,
      relativeAccuracy: entity.relativeAccuracy,
      calculatedRelativeAccuracy: entity.calculatedRelativeAccuracy,
      overallBiasAdjustmentFactor: entity.overallBiasAdjustmentFactor,
      calculatedOverallBiasAdjustmentFactor:
        entity.calculatedOverallBiasAdjustmentFactor,
      numberLoadLevel: entity.numberLoadLevel,
      calculatedNumberLoadLevel: entity.calculatedNumberLoadLevel,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

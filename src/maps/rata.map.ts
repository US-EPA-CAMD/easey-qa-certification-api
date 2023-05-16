import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { RataDTO } from '../dto/rata.dto';
import { Rata } from '../entities/rata.entity';
import { RataSummaryMap } from './rata-summary.map';

@Injectable()
export class RataMap extends BaseMap<Rata, RataDTO> {
  constructor(private readonly rataSummaryMap: RataSummaryMap) {
    super();
  }
  public async one(entity: Rata): Promise<RataDTO> {
    const rataSummaries = entity.rataSummaries
      ? await this.rataSummaryMap.many(entity.rataSummaries)
      : [];

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
      numberOfLoadLevels: entity.numberOfLoadLevels,
      calculatedNumberOfLoadLevel: entity.calculatedNumberOfLoadLevels,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
      rataSummaryData: rataSummaries,
    };
  }
}

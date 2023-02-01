import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';
import { FlowToLoadCheckDTO } from '../dto/flow-to-load-check.dto';

@Injectable()
export class FlowToLoadCheckMap extends BaseMap<
  FlowToLoadCheck,
  FlowToLoadCheckDTO
> {
  public async one(entity: FlowToLoadCheck): Promise<FlowToLoadCheckDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      testBasisCode: entity.testBasisCode,
      biasAdjustedIndicator: entity.biasAdjustedIndicator,
      avgAbsolutePercentDiff: entity.averageAbsolutePercentDifference,
      numberOfHours: entity.numberOfHours,
      numberOfHoursExcludedForFuel: entity.numberOfHoursExcludedForFuel,
      numberOfHoursExcludedRamping: entity.numberOfHoursExcludedForRamping,
      numberOfHoursExcludedBypass: entity.numberOfHoursExcludedForBypass,
      numberOfHoursExcludedPreRATA: entity.numberOfHoursExcludedPreRata,
      numberOfHoursExcludedTest: entity.numberOfHoursExcludedTest,
      numberOfHoursExcMainBypass: entity.numberOfHoursExcludedForMainAndBypass,
      operatingLevelCode: entity.operatingLevelCode,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { FuelFlowToLoadTestDTO } from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';

@Injectable()
export class FuelFlowToLoadTestMap extends BaseMap<
  FuelFlowToLoadTest,
  FuelFlowToLoadTestDTO
> {
  public async one(entity: FuelFlowToLoadTest): Promise<FuelFlowToLoadTestDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      testBasisCode: entity.testBasisCode,
      averageDifference: entity.averageDifference,
      numberOfHoursUsed: entity.numberOfHoursUsed,
      numberOfHoursExcludedCofiring: entity.numberOfHoursExcludedCofiring,
      numberOfHoursExcludedRamping: entity.numberOfHoursExcludedRamping,
      numberOfHoursExcludedLowRange: entity.numberOfHoursExcludedLowRange,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { FuelFlowmeterAccuracyDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';

@Injectable()
export class FuelFlowmeterAccuracyMap extends BaseMap<
  FuelFlowmeterAccuracy,
  FuelFlowmeterAccuracyDTO
> {
  public async one(
    entity: FuelFlowmeterAccuracy,
  ): Promise<FuelFlowmeterAccuracyDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      accuracyTestMethodCode: entity.accuracyTestMethodCode,
      reinstallationHour: entity.reinstallationHour,
      lowFuelAccuracy: entity.lowFuelAccuracy,
      midFuelAccuracy: entity.midFuelAccuracy,
      highFuelAccuracy: entity.highFuelAccuracy,
      reinstallationDate: entity.reinstallationDate,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

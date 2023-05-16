import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaseline } from '../entities/fuel-flow-to-load-baseline.entity';

@Injectable()
export class FuelFlowToLoadBaselineMap extends BaseMap<
  FuelFlowToLoadBaseline,
  FuelFlowToLoadBaselineDTO
> {
  public async one(
    entity: FuelFlowToLoadBaseline,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      accuracyTestNumber: entity.accuracyTestNumber,
      peiTestNumber: entity.peiTestNumber,
      averageFuelFlowRate: entity.averageFuelFlowRate,
      averageLoad: entity.averageLoad,
      baselineFuelFlowToLoadRatio: entity.baselineFuelFlowToLoadRatio,
      fuelFlowToLoadUOMCode: entity.fuelFlowToLoadUOMCode,
      averageHourlyHeatInputRate: entity.averageHourlyHeatInputRate,
      baselineGHR: entity.baselineGHR,
      ghrUnitsOfMeasureCode: entity.ghrUnitsOfMeasureCode,
      numberOfHoursExcludedCofiring: entity.numberOfHoursExcludedCofiring,
      numberOfHoursExcludedRamping: entity.numberOfHoursExcludedRamping,
      numberOfHoursExcludedLowRange: entity.numberOfHoursExcludedLowRange,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

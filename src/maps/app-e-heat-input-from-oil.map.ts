import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { AppEHeatInputFromOilDTO } from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOil } from '../entities/app-e-heat-input-from-oil.entity';

@Injectable()
export class AppEHeatInputFromOilMap extends BaseMap<
  AppEHeatInputFromOil,
  AppEHeatInputFromOilDTO
> {
  public async one(
    entity: AppEHeatInputFromOil,
  ): Promise<AppEHeatInputFromOilDTO> {
    return {
      id: entity.id,
      appECorrelationTestId: entity.aeCorrTestRunId,
      oilMass: entity.oilMass,
      calculatedOilMass: entity.calculatedOilMass,
      oilHeatInput: entity.oilHeatInput,
      calculatedOilHeatInput: entity.calculatedOilHeatInput,
      oilGCV: entity.oilGCV,
      oilGCVUnitsOfMeasureCode: entity.oilGcvUomCode,
      oilVolume: entity.oilVolume,
      oilVolumeUnitsOfMeasureCode: entity.oilVolumeUomCode,
      oilDensity: entity.oilDensity,
      oilDensityUnitsOfMeasureCode: entity.oilDensityUomCode,
      monitoringSystemId: entity.monitoringSystemId,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}

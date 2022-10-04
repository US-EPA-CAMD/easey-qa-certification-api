import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { AppEHeatInputOilDTO } from '../dto/app-e-heat-input-oil.dto';
import { AppEHeatInputOil } from '../entities/app-e-heat-input-oil.entity'

@Injectable()
export class AppEHeatInputOilMap extends BaseMap<AppEHeatInputOil, AppEHeatInputOilDTO> {
  public async one(entity: AppEHeatInputOil): Promise<AppEHeatInputOilDTO> {
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
    }
  }
}
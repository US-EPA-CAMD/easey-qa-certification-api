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
      appECorrTestRunId: entity.appECorrTestRunId,
      monitoringSystemID: entity.system.monitoringSystemID,
      oilMass: entity.oilMass,
      calculatedOilMass: entity.calculatedOilMass,
      oilGCV: entity.oilGCV,
      oilGCVUnitsOfMeasureCode: entity.oilGCVUnitsOfMeasureCode,
      oilHeatInput: entity.oilHeatInput,
      calculatedOilHeatInput: entity.calculatedOilHeatInput,
      oilVolume: entity.oilVolume,
      oilVolumeUnitsOfMeasureCode: entity.oilVolumeUnitsOfMeasureCode,
      oilDensity: entity.oilDensity,
      oilDensityUnitsOfMeasureCode: entity.oilDensityUnitsOfMeasureCode,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

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
      monitoringSystemID: entity.monitoringSystemID,
      oilMass: entity.oilMass,
      calculatedOilMass: entity.calculatedOilMass,
      oilGCV: entity.oilGCV,
      oilGCVUomCode: entity.oilGCVUomCode,
      oilHeatInput: entity.oilHeatInput,
      calculatedOilHeatInput: entity.calculatedOilHeatInput,
      oilVolume: entity.oilVolume,
      oilVolumeUomCode: entity.oilVolumeUomCode,
      oilDensity: entity.oilDensity,
      oilDensityUomCode: entity.oilDensityUomCode,
      monitoringSystemId: entity.monitoringSystemID,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

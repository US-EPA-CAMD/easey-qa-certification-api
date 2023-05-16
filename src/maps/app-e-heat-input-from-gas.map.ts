import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AppEHeatInputFromGasDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';

@Injectable()
export class AppEHeatInputFromGasMap extends BaseMap<
  AppEHeatInputFromGas,
  AppEHeatInputFromGasDTO
> {
  public async one(
    entity: AppEHeatInputFromGas,
  ): Promise<AppEHeatInputFromGasDTO> {
    return {
      id: entity.id,
      appECorrTestRunId: entity.appECorrTestRunId,
      monitoringSystemID: entity.system.monitoringSystemID,
      gasGCV: entity.gasGCV,
      gasVolume: entity.gasVolume,
      gasHeatInput: entity.gasHeatInput,
      calculatedGasHeatInput: entity.calculatedGasHeatInput,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

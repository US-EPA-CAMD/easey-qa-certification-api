import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';
import { AppEHeatInputFromGasDTO } from '../dto/app-e-heat-input-from-gas.dto';

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
      appECorrelationTestRunId: entity.appECorrelationTestRunId,
      gasVolume: entity.gasVolume,
      gasGCV: entity.gasGCV,
      gasHeatInput: entity.gasHeatInput,
      calculatedGasHeatInput: entity.calculatedGasHeatInput,
      monitoringSystemId: entity.monitoringSystemId,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

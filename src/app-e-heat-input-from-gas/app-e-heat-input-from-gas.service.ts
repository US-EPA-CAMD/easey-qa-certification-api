import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { AppEHeatInputFromGasRecordDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromGasRepository } from './app-e-heat-input-from-gas.repository';

@Injectable()
export class AppEHeatInputFromGasService {
  constructor(
    private readonly map: AppEHeatInputFromGasMap,
    @InjectRepository(AppEHeatInputFromGasRepository)
    private readonly repository: AppEHeatInputFromGasRepository,
  ) {}

  async getAppEHeatInputFromGases(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromGasRecordDTO[]> {
    const records = await this.repository.getAppEHeatInputFromGasByTestRunId(
      appECorrTestRunId,
    );

    return this.map.many(records);
  }

  async getAppEHeatInputFromGas(
    id: string,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    const result = await this.repository.getAppEHeatInputFromGasById(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input From Gas record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasRepository } from './protocol-gas.repository';

@Injectable()
export class ProtocolGasService {
  constructor(
    private readonly repository: ProtocolGasRepository,
    private readonly map: ProtocolGasMap,
  ) {}

  async getProtocolGases(testSumId: string): Promise<ProtocolGasDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async getProtocolGas(id: string): Promise<ProtocolGasDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(`Protocol Gas record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getProtocolGasByTestSumIds(
    testSumIds: string[],
  ): Promise<ProtocolGasDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<ProtocolGasDTO[]> {
    return this.getProtocolGasByTestSumIds(testSumIds);
  }
}

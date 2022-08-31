import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasRepository } from './protocol-gas.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class ProtocolGasService {
  constructor(
    @InjectRepository(ProtocolGasRepository)
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
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Protocol Gas record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

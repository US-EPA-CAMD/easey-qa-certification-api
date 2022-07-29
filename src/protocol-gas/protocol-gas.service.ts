import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasRepository } from './protocol-gas.repository';

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
}

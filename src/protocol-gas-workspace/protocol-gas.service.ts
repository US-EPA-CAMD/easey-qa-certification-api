import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';

@Injectable()
export class ProtocolGasWorkspaceService {
  constructor(
    @InjectRepository(ProtocolGasWorkspaceRepository)
    private readonly repository: ProtocolGasWorkspaceRepository,
    private readonly map: ProtocolGasMap,
  ) {}

  async getProtocolGases(testSumId: string): Promise<ProtocolGasDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }
}

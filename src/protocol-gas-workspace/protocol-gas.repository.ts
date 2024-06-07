import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ProtocolGas } from '../entities/workspace/protocol-gas.entity';

@Injectable()
export class ProtocolGasWorkspaceRepository extends Repository<ProtocolGas> {
  constructor(entityManager: EntityManager) {
    super(ProtocolGas, entityManager);
  }
}

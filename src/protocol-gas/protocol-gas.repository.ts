import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ProtocolGas } from '../entities/protocol-gas.entity';

@Injectable()
export class ProtocolGasRepository extends Repository<ProtocolGas> {
  constructor(entityManager: EntityManager) {
    super(ProtocolGas, entityManager);
  }
}

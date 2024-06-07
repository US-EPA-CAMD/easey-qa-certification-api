import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { GasComponentCode } from '../entities/gas-component-code.entity';

@Injectable()
export class GasComponentCodeRepository extends Repository<GasComponentCode> {
  constructor(entityManager: EntityManager) {
    super(GasComponentCode, entityManager);
  }
}

import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { GasTypeCode } from '../entities/workspace/gas-type-code.entity';

@Injectable()
export class GasTypeCodeRepository extends Repository<GasTypeCode> {
  constructor(entityManager: EntityManager) {
    super(GasTypeCode, entityManager);
  }
}

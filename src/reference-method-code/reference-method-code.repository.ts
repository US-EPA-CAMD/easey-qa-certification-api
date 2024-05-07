import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ReferenceMethodCode } from '../entities/workspace/reference-method-code.entity';

@Injectable()
export class ReferenceMethodCodeRepository extends Repository<
  ReferenceMethodCode
> {
  constructor(entityManager: EntityManager) {
    super(ReferenceMethodCode, entityManager);
  }
}

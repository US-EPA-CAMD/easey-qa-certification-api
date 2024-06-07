import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';

@Injectable()
export class RataFrequencyCodeRepository extends Repository<RataFrequencyCode> {
  constructor(entityManager: EntityManager) {
    super(RataFrequencyCode, entityManager);
  }

  async getRataFrequencyCode(
    rataFrequencyCode: string,
  ): Promise<RataFrequencyCode> {
    return this.createQueryBuilder('rfc')
      .where('rfc.rataFrequencyCode = :rataFrequencyCode', {
        rataFrequencyCode,
      })
      .getOne();
  }
}

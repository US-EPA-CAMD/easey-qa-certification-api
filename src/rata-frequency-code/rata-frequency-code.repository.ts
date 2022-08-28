import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RataFrequencyCode)
export class RataFrequencyCodeRepository extends Repository<RataFrequencyCode> {
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

import { EntityRepository, Repository } from 'typeorm';
import { GasTypeCode } from '../entities/workspace/gas-type-code.entity';

@EntityRepository(GasTypeCode)
export class GasTypeCodeRepository extends Repository<GasTypeCode> {}

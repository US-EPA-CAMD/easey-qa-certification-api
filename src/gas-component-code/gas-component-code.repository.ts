import { EntityRepository, Repository } from 'typeorm';
import { GasComponentCode } from '../entities/gas-component-code.entity';

@EntityRepository(GasComponentCode)
export class GasComponentCodeRepository extends Repository<GasComponentCode> {}

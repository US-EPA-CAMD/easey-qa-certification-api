import { EntityRepository, Repository } from 'typeorm';
import { ProtocolGas } from '../entities/protocol-gas.entity';

@EntityRepository(ProtocolGas)
export class ProtocolGasRepository extends Repository<ProtocolGas> {}

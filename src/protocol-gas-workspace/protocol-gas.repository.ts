import { EntityRepository, Repository } from 'typeorm';
import { ProtocolGas } from '../entities/workspace/protocol-gas.entity';

@EntityRepository(ProtocolGas)
export class ProtocolGasWorkspaceRepository extends Repository<ProtocolGas> {}

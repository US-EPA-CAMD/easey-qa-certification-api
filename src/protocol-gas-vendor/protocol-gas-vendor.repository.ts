import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ProtocolGasVendor } from '../entities/protocol-gas-vendor.entity';

@Injectable()
export class ProtocolGasVendorRepository extends Repository<ProtocolGasVendor> {
  constructor(entityManager: EntityManager) {
    super(ProtocolGasVendor, entityManager);
  }
}

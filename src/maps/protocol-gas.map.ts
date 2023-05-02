import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGas } from '../entities/protocol-gas.entity';

@Injectable()
export class ProtocolGasMap extends BaseMap<ProtocolGas, ProtocolGasDTO> {
  public async one(entity: ProtocolGas): Promise<ProtocolGasDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      gasLevelCode: entity.gasLevelCode,
      gasTypeCode: entity.gasTypeCode,
      vendorIdentifier: entity.vendorIdentifier,
      cylinderIdentifier: entity.cylinderIdentifier,
      expirationDate: entity.expirationDate,
      userId: entity.userId,
      addDate: entity.addDate.toLocaleString(),
      updateDate: entity.updateDate.toLocaleString(),
    };
  }
}

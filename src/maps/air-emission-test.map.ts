import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AirEmissionTestDTO } from '../dto/air-emission-test.dto';
import { AirEmissionTest } from '../entities/air-emission-test.entity';

@Injectable()
export class AirEmissionTestMap extends BaseMap<
  AirEmissionTest,
  AirEmissionTestDTO
> {
  public async one(entity: AirEmissionTest): Promise<AirEmissionTestDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,

      qiLastName: entity.qiLastName,
      qiFirstName: entity.qiFirstName,
      qiMiddleInitial: entity.qiMiddleInitial,
      aetbName: entity.aetbName,
      aetbPhoneNumber: entity.aetbPhoneNumber,
      aetbEmail: entity.aetbEmail,
      examDate: entity.examDate,
      providerName: entity.providerName,
      providerEmail: entity.providerEmail,

      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

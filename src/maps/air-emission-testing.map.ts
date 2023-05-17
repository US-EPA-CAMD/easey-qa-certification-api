import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AirEmissionTestingDTO } from '../dto/air-emission-test.dto';
import { AirEmissionTesting } from '../entities/air-emission-test.entity';

@Injectable()
export class AirEmissionTestingMap extends BaseMap<
  AirEmissionTesting,
  AirEmissionTestingDTO
> {
  public async one(entity: AirEmissionTesting): Promise<AirEmissionTestingDTO> {
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
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

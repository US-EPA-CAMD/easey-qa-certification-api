import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { TestQualificationDTO } from '../dto/test-qualification.dto';
import { TestQualification } from '../entities/test-qualification.entity';

@Injectable()
export class TestQualificationMap extends BaseMap<
  TestQualification,
  TestQualificationDTO
> {
  public async one(entity: TestQualification): Promise<TestQualificationDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      testClaimCode: entity.testClaimCode,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      highLoadPercentage: entity.highLoadPercentage,
      midLoadPercentage: entity.midLoadPercentage,
      lowLoadPercentage: entity.lowLoadPercentage,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

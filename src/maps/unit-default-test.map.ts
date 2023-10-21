import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitDefaultTestDTO } from '../dto/unit-default-test.dto';
import { UnitDefaultTest } from '../entities/unit-default-test.entity';

@Injectable()
export class UnitDefaultTestMap extends BaseMap<
  UnitDefaultTest,
  UnitDefaultTestDTO
> {
  public async one(entity: UnitDefaultTest): Promise<UnitDefaultTestDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      fuelCode: entity.fuelCode,
      noxDefaultRate: entity.noxDefaultRate,
      calculatedNoxDefaultRate: entity.calculatedNoxDefaultRate,
      operatingConditionCode: entity.operatingConditionCode,
      groupId: entity.groupId,
      numberOfUnitsInGroup: entity.numberOfUnitsInGroup,
      numberOfTestsForGroup: entity.numberOfTestsForGroup,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
      unitDefaultTestRunData: [],
    };
  }
}

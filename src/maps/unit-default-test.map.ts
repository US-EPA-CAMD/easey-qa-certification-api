import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitDefaultTestDTO } from 'src/dto/unit-default-test.dto';
import { UnitDefaultTest } from 'src/entities/unit-default-test.entity';

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
      NOxDefaultRate: entity.NOxDefaultRate,
      calculatedNOxDefaultRate: entity.calculatedNOxDefaultRate,
      operatingConditionCode: entity.operatingConditionCode,
      groupID: entity.groupID,
      numberOfUnitsInGroup: entity.numberOfUnitsInGroup,
      numberOfTestsForGroup: entity.numberOfTestsForGroup,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
      unitDefaultTestRunData: [],
    };
  }
}

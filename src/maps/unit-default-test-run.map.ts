import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitDefaultTestRunDTO } from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRun } from '../entities/unit-default-test-run.entity';

@Injectable()
export class UnitDefaultTestRunMap extends BaseMap<
  UnitDefaultTestRun,
  UnitDefaultTestRunDTO
> {
  public async one(entity: UnitDefaultTestRun): Promise<UnitDefaultTestRunDTO> {
    return {
      id: entity.id,
      unitDefaultTestSumId: entity.unitDefaultTestSumId,
      operatingLevelForRun: entity.operatingLevelForRun,
      runNumber: entity.runNumber,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      beginMinute: entity.beginMinute,
      endDate: entity.endDate,
      endHour: entity.endHour,
      endMinute: entity.endMinute,
      responseTime: entity.responseTime,
      referenceValue: entity.referenceValue,
      runUsedIndicator: entity.runUsedIndicator,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

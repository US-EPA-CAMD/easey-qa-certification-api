import { Injectable } from '@nestjs/common/decorators';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjection } from '../entities/hg-injection.entity';

@Injectable()
export class HgInjectionMap extends BaseMap<HgInjection, HgInjectionDTO> {
  public async one(entity: HgInjection): Promise<HgInjectionDTO> {
    return {
      id: entity.id,
      hgTestSumId: entity.hgTestSumId,
      injectionDate: entity.injectionDate,
      injectionHour: entity.injectionHour,
      injectionMinute: entity.injectionMinute,
      measuredValue: entity.measuredValue,
      referenceValue: entity.referenceValue,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

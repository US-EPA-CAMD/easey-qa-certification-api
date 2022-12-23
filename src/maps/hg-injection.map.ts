import { Injectable } from '@nestjs/common/decorators';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { HgInjectionDTO } from 'src/dto/hg-injection.dto';
import { HgInjection } from 'src/entities/hg-injection.entity';

@Injectable()
export class HgInjectionMap extends BaseMap<HgInjection, HgInjectionDTO> {
  public async one(entity: HgInjection): Promise<HgInjectionDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      injectionDate: entity.injectionDate,
      injectionHour: entity.injectionHour,
      injectionMinute: entity.injectionMinute,
      measuredValue: entity.measuredValue,
      referenceValue: entity.referenceValue,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

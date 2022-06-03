import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { LinearityInjection } from '../entities/linearity-injection.entity';
import { LinearityInjectionDTO } from '../dto/linearity-injection.dto';

@Injectable()
export class LinearityInjectionMap extends BaseMap<LinearityInjection, LinearityInjectionDTO> {
  public async one(entity: LinearityInjection): Promise<LinearityInjectionDTO> {
    return {
      id: entity.id,
      injectionDate: entity.injectionDate,
      injectionHour: entity.injectionHour,
      injectionMinute: entity.injectionMinute,
      measuredValue: entity.measuredValue,
      referenceValue: entity.referenceValue,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
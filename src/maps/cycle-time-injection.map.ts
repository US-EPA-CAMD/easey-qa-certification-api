import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';

@Injectable()
export class CycleTimeInjectionMap extends BaseMap<
  CycleTimeInjection,
  CycleTimeInjectionDTO
> {
  public async one(entity: CycleTimeInjection): Promise<CycleTimeInjectionDTO> {
    return {
      id: entity.id,
      cycleTimeSumId: entity.cycleTimeSumId,
      gasLevelCode: entity.gasLevelCode,
      calibrationGasValue: entity.calibrationGasValue,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      beginMinute: entity.beginMinute,
      endDate: entity.endDate,
      endHour: entity.endHour,
      endMinute: entity.endMinute,
      injectionCycleTime: entity.injectionCycleTime,
      calculatedInjectionCycleTime: entity.calculatedInjectionCycleTime,
      beginMonitorValue: entity.beginMonitorValue,
      endMonitorValue: entity.endMonitorValue,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

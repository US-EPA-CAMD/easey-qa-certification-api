import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { CycleTimeSummary } from '../entities/cycle-time-summary.entity';
import { CycleTimeInjectionMap } from './cycle-time-injection.map';

@Injectable()
export class CycleTimeSummaryMap extends BaseMap<
  CycleTimeSummary,
  CycleTimeSummaryDTO
> {
  constructor(private readonly cycleTimeInjectionMap: CycleTimeInjectionMap) {
    super();
  }

  public async one(entity: CycleTimeSummary): Promise<CycleTimeSummaryDTO> {
    const cycleTimeInjections = entity.cycleTimeInjections
      ? await this.cycleTimeInjectionMap.many(entity.cycleTimeInjections)
      : [];

    return {
      id: entity.id,
      testSumId: entity.testSumId,
      totalTime: entity.totalTime,
      calculatedTotalTime: entity.calculatedTotalTime,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
      cycleTimeInjectionData: cycleTimeInjections,
    };
  }
}

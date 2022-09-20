import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { RataRunDTO } from '../dto/rata-run.dto';
import { RataRun } from '../entities/rata-run.entity';
import { FlowRataRunMap } from './flow-rata-run.map';

@Injectable()
export class RataRunMap extends BaseMap<RataRun, RataRunDTO> {
  constructor(private readonly flowRataRunMap: FlowRataRunMap) {
    super();
  }
  public async one(entity: RataRun): Promise<RataRunDTO> {
    const flowRataRuns = entity.FlowRataRuns
      ? await this.flowRataRunMap.many(entity.FlowRataRuns)
      : [];

    return {
      id: entity.id,
      rataSumId: entity.rataSumId,
      runNumber: entity.runNumber,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      beginMinute: entity.beginMinute,
      endDate: entity.endDate,
      endHour: entity.endHour,
      endMinute: entity.endMinute,
      cemValue: entity.cemValue,
      rataReferenceValue: entity.rataReferenceValue,
      calculatedRataReferenceValue: entity.calculatedRataReferenceValue,
      grossUnitLoad: entity.grossUnitLoad,
      runStatusCode: entity.runStatusCode,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
      flowRataRunData: flowRataRuns,
    };
  }
}

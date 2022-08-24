import { Injectable } from '@nestjs/common';
import { RataRunDTO } from '../dto/rata-run.dto';
import { RataRun } from '../entities/rata-run.entity';
import { BaseMap } from '@us-epa-camd/easey-common/maps';


@Injectable()
export class RataRunMap extends BaseMap<RataRun, RataRunDTO> {

  public async one(entity: RataRun): Promise<RataRunDTO> {
    return {
      id: entity.id,
      rataSummaryId: entity.rataSummaryId,
      runNumber: entity.runNumber,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      beginMinute: entity.beginMinute,
      endDate: entity.endDate,
      endHour: entity.endHour,
      endMinute: entity.endMinute,
      cemValue: entity.cemValue,
      rataReferenceValue: entity.rataReferenceValue,
      grossUnitLoad: entity.grossUnitLoad,
      runStatusCode: entity.runStatusCode
    }
  }

}
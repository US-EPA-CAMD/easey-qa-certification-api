import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { MatsDataSubmission } from '../entities/mats-data-submission.entity';
import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';

@Injectable()
export class MatsDataSubmissionMap extends BaseMap<
  MatsDataSubmission,
  MatsDataSubmissionDTO
> {
  public async one(entity: MatsDataSubmission) {
    return {
      id: entity.id,
      averagingGroup: entity.averagingGroup?.description ?? null,
      facilityName: entity.facility?.name ?? null,
      frsId: entity.facility?.frsId ?? null,
      location:
        entity.location?.unit?.name ?? entity.location?.stackPipe?.name ?? null,
      orisCode: entity.facility?.orisCode ?? null,
      pollutants: entity.pollutants?.map(p => p.description) ?? null,
      quarter: entity.quarter,
      reportType: entity.reportType?.description ?? null,
      status: entity.status?.description ?? null,
      testComment: entity.testComment,
      testDate: entity.testDate,
      testMethods: entity.testMethods?.map(m => m.description) ?? null,
      testNumber: entity.testNumber,
      year: entity.year,
    };
  }
}

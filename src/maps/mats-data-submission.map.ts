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
      averagingGroupCode: entity.averagingGroup?.code ?? null,
      facilityId: entity.facility?.id ?? null,
      locationId: entity.location?.id ?? null,
      monitorPlanId: entity.plan?.id ?? null,
      originalSubmissionId: entity.originalSubmissionId,
      pollutantCodes: entity.pollutants?.map(p => p.code) ?? [],
      quarter: entity.quarter,
      reportTypeCode: entity.reportType?.code ?? null,
      statusCode: entity.status?.code ?? null,
      testComment: entity.testComment,
      testDate: entity.testDate,
      testMethodCodes: entity.testMethods?.map(t => t.code) ?? [],
      testNumber: entity.testNumber,
      year: entity.year,
      userId: entity.userId,
      addDate: entity.addTime?.toISOString() ?? null,
      updateDate: entity.updateTime?.toISOString() ?? null,
    };
  }
}

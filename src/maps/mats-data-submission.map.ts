import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { MatsDataSubmission } from '../entities/mats-data-submission.entity';
import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';
import { MatsCodeMap } from './mats-code.map';

@Injectable()
export class MatsDataSubmissionMap extends BaseMap<
  MatsDataSubmission,
  MatsDataSubmissionDTO
> {
  constructor(private readonly codeMap: MatsCodeMap) {
    super();
  }

  public async one(entity: MatsDataSubmission) {
    return {
      id: entity.id,
      averagingGroup: entity.averagingGroup
        ? await this.codeMap.one(entity.averagingGroup)
        : null,
      facilityName: entity.facility?.name ?? null,
      frsId: entity.facility?.frsId ?? null,
      location: entity.location
        ? {
            id: entity.location.id,
            name:
              entity.location.unit?.name ??
              entity.location.stackPipe?.name ??
              null,
          }
        : null,
      orisCode: entity.facility?.orisCode ?? null,
      pollutants: entity.pollutants
        ? await this.codeMap.many(entity.pollutants)
        : null,
      quarter: entity.quarter,
      reportType: entity.reportType
        ? await this.codeMap.one(entity.reportType)
        : null,
      status: entity.status ? await this.codeMap.one(entity.status) : null,
      testComment: entity.testComment,
      testDate: entity.testDate,
      testMethods: entity.testMethods
        ? await this.codeMap.many(entity.testMethods)
        : null,
      testNumber: entity.testNumber,
      year: entity.year,
    };
  }
}

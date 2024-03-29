import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { TestSummaryReviewAndSubmit } from '../entities/workspace/test-summary-review-and-submit.entity';
import { TestSummaryReviewAndSubmitGlobal } from '../entities/test-summary-review-and-submit.entity';

@Injectable()
export class ReviewAndSubmitTestSummaryMap extends BaseMap<
  TestSummaryReviewAndSubmit,
  ReviewAndSubmitTestSummaryDTO
> {
  public async one(
    entity: TestSummaryReviewAndSubmit | TestSummaryReviewAndSubmitGlobal,
  ): Promise<ReviewAndSubmitTestSummaryDTO> {
    return {
      orisCode: entity.orisCode,

      facilityName: entity.facilityName,

      monPlanId: entity.monPlanId,

      locationInfo: entity.locationInfo,

      systemComponentId: entity.systemComponentId,

      testTypeCode: entity.testTypeCode,

      testNum: entity.testNum,

      beginDate: entity.beginDate,

      endDate: entity.endDate,

      userId: entity.userId,

      updateDate: entity.updateDate.toISOString(),

      evalStatusCode: entity.evalStatusCode,

      evalStatusCodeDescription: entity.evalStatusCodeDescription,

      submissionAvailabilityCode: entity.submissionCode,

      submissionCodeDescription: entity.submissionAvailabilityCodeDescription,

      periodAbbreviation: entity.periodAbbreviation,

      testSumId: entity.testSumId,
    };
  }
}

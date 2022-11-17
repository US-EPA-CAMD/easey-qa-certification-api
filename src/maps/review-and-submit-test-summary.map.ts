import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { TestSummaryReviewAndSubmit } from '../entities/test-summary-review-and-submit.entity';

@Injectable()
export class ReviewAndSubmitTestSummaryMap extends BaseMap<
  TestSummaryReviewAndSubmit,
  ReviewAndSubmitTestSummaryDTO
> {
  public async one(
    entity: TestSummaryReviewAndSubmit,
  ): Promise<ReviewAndSubmitTestSummaryDTO> {
    return {
      orisCd: entity.orisCd,

      facilityName: entity.facilityName,

      monPlanId: entity.monPlanId,

      locationInfo: entity.locationInfo,

      testInfo: entity.testInfo,

      testTypeCode: entity.testTypeCode,

      testNum: entity.testNum,

      beginDate: entity.beginDate,

      endDate: entity.endDate,

      userId: entity.userId,

      updateDate: entity.updateDate,
      evalStatusCd: entity.evalStatusCd,

      submissionCd: entity.submissionCd,
    };
  }
}

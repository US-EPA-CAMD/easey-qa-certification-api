import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { TeeReviewAndSubmit } from '../entities/workspace/tee-review-and-submit.entity';
import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';

@Injectable()
export class TeeReviewAndSubmitMap extends BaseMap<
  TeeReviewAndSubmit,
  TeeReviewAndSubmitDTO
> {
  public async one(entity: TeeReviewAndSubmit): Promise<TeeReviewAndSubmitDTO> {
    return {
      orisCode: entity.orisCode,
      facilityName: entity.facilityName,
      monPlanId: entity.monPlanId,
      locationInfo: entity.locationInfo,
      testExtensionExemptionIdentifier: entity.testExtensionExemptionIdentifier,
      extensExemptCode: entity.extensExemptCode,
      monLocIdentifier: entity.monLocIdentifier,
      systemComponentIdentifier: entity.systemComponentIdentifier,
      rptPeriodIdentifier: entity.rptPeriodIdentifier,
      userid: entity.userid,
      updateDate: entity.updateDate,
      evalStatusCode: entity.evalStatusCode,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      periodAbbreviation: entity.periodAbbreviation,
      fuelCode: entity.fuelCode,
      hoursUsed: entity.hoursUsed,
      spanScaleCode: entity.spanScaleCode,
    };
  }
}

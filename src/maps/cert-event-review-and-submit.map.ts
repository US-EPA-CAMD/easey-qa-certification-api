import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { CertEventReviewAndSubmit } from '../entities/workspace/cert-event-review-and-submit.entity';
import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';

@Injectable()
export class CertEventReviewAndSubmitMap extends BaseMap<
  CertEventReviewAndSubmit,
  CertEventReviewAndSubmitDTO
> {
  public async one(
    entity: CertEventReviewAndSubmit,
  ): Promise<CertEventReviewAndSubmitDTO> {
    return {
      orisCode: entity.orisCode,
      facilityName: entity.facilityName,
      monPlanId: entity.monPlanId,
      locationInfo: entity.locationInfo,
      qaCertEventIdentifier: entity.qaCertEventIdentifier,
      qaCertEventCode: entity.qaCertEventCode,
      monLocIdentifier: entity.monLocIdentifier,
      systemComponentIdentifier: entity.systemComponentIdentifier,
      rptPeriodIdentifier: null,
      eventDate: entity.eventDate,
      conditionDate: entity.conditionDate,
      lastCompletion: entity.lastCompletion,
      userid: entity.userid,
      updateDate: entity.updateDate.toLocaleString(),
      evalStatusCode: entity.evalStatusCode,
      evalStatusCodeDescription: entity.evalStatusCodeDescription,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      submissionAvailabilityDescription:
        entity.submissionAvailabilityCodeDescription,
      periodAbbreviation: null,
      requiredTestCode: entity.requiredTestCode,
    };
  }
}

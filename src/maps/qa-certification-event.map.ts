import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { QACertificationEvent } from '../entities/workspace/qa-certification-event.entity';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';

@Injectable()
export class QACertificationEventMap extends BaseMap<
  QACertificationEvent,
  QACertificationEventDTO
> {
  public async one(
    entity: QACertificationEvent,
  ): Promise<QACertificationEventDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      stackPipeId:
        entity.location && entity.location.stackPipe
          ? entity.location.stackPipe.name
          : null,
      unitId:
        entity.location && entity.location.unit
          ? entity.location.unit.name
          : null,
      monitoringSystemID: entity.system ? entity.system.id : null,
      componentID: entity.component ? entity.component.id : null,
      qaCertEventCode: entity.qaCertEventCode,
      qaCertEventDate: entity.qaCertEventDate,
      qaCertEventHour: entity.qaCertEventHour,
      requiredTestCode: entity.requiredTestCode,
      conditionalBeginDate: entity.conditionalBeginDate,
      conditionalBeginHour: entity.conditionalBeginHour,
      completionTestDate: entity.completionTestDate,
      completionTestHour: entity.completionTestHour,
      lastUpdated: entity.lastUpdated,
      updatedStatusFlag: entity.updatedStatusFlag,
      needsEvalFlag: entity.needsEvalFlag,
      checkSessionId: entity.checkSessionId,
      submissionId: entity.submissionId,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      pendindStatusCode: entity.pendindStatusCode,
      evalStatusCode: entity.evalStatusCode,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}

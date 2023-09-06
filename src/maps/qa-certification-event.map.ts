import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';
import { QACertificationEvent } from '../entities/qa-certification-event.entity';

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
      locationId: entity.location.id,
      stackPipeId: entity.location.stackPipe
        ? entity.location.stackPipe.name
        : null,
      unitId: entity.location.unit ? entity.location.unit.name : null,
      monitoringSystemId: entity.system
        ? entity.system.monitoringSystemID
        : null,
      componentId: entity.component ? entity.component.componentID : null,
      certificationEventCode: entity.qaCertEventCode,
      certificationEventDate: entity.qaCertEventDate,
      certificationEventHour: entity.qaCertEventHour,
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
      pendingStatusCode: entity['pendingStatusCode'] || null,
      evalStatusCode: entity['evalStatusCode'] || null,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

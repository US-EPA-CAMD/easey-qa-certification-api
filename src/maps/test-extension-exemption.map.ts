import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { TestExtensionExemptionDTO } from '../dto/test-extension-exemption.dto';
import { TestExtensionExemption } from '../entities/test-extension-exemption.entity';

@Injectable()
export class TestExtensionExemptionMap extends BaseMap<
  TestExtensionExemption,
  TestExtensionExemptionDTO
> {
  public async one(
    entity: TestExtensionExemption,
  ): Promise<TestExtensionExemptionDTO> {
    return {
      id: entity.id,
      locationId: entity.location.id,
      stackPipeId:
        entity.location && entity.location.stackPipe
          ? entity.location.stackPipe.name
          : null,
      unitId:
        entity.location && entity.location.unit
          ? entity.location.unit.name
          : null,
      year: entity.reportingPeriod ? entity.reportingPeriod.year : null,
      quarter: entity.reportingPeriod ? entity.reportingPeriod.quarter : null,
      monitoringSystemID: entity.system
        ? entity.system.monitoringSystemID
        : null,
      componentID: entity.component ? entity.component.componentID : null,
      hoursUsed: entity.hoursUsed,
      spanScaleCode: entity.spanScaleCode,
      fuelCode: entity.fuelCode,
      extensionOrExemptionCode: entity.extensionOrExemptionCode,
      reportPeriodId: entity.reportPeriodId,
      checkSessionId: entity.checkSessionId,
      submissionId: entity.submissionId,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      pendingStatusCode: entity['pendingStatusCode']
        ? entity['pendingStatusCode']
        : null,
      evalStatusCode: entity['evalStatusCode']
        ? entity['evalStatusCode']
        : null,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}

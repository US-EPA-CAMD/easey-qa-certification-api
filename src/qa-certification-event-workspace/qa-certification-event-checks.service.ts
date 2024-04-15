import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  QACertificationEventBaseDTO,
  QACertificationEventImportDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';

const KEY = 'QA Certification Event';

@Injectable()
export class QACertificationEventChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: QACertificationEventWorkspaceRepository,
    private readonly service: QACertificationEventWorkspaceService,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new EaseyException(
        new Error(errorList.join('\n')),
        HttpStatus.BAD_REQUEST,
        { responseObject: errorList },
      );
    }
  }

  async runChecks(
    locationId: string,
    qaCertificationEvent:
      | QACertificationEventBaseDTO
      | QACertificationEventImportDTO,
    qaCertificationEvents:
      | QACertificationEventBaseDTO[]
      | QACertificationEventImportDTO[],
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.logger.log('Running QA Certification Event Checks');

    if (!isUpdate) {
      error = await this.QACertEvent11DuplicateCheck(
        qaCertificationEvent,
        qaCertificationEvents,
        locationId,
        isImport,
      );
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed QA Certification Event Checks');
    return errorList;
  }

  private async QACertEvent11DuplicateCheck(
    qaCertificationEvent:
      | QACertificationEventBaseDTO
      | QACertificationEventImportDTO,
    qaCertificationEvents:
      | QACertificationEventBaseDTO[]
      | QACertificationEventImportDTO[],
    locationId: string,
    isImport: boolean,
  ) {
    let error = null;
    let qaCertEvents = [];

    const duplicateQACertEvent = this.getErrorMessage('QACERT-11-A', {
      recordtype: KEY,
      fieldnames:
        'locationId, certificationEventCode, certificationEventHour, certificationEventDate, monitoringSystemId, componentId',
    });

    if (isImport) {
      const duplicates = qaCertificationEvents.filter(i => {
        return (
          i.certificationEventCode ===
            qaCertificationEvent.certificationEventCode &&
          i.certificationEventHour ===
            qaCertificationEvent.certificationEventHour &&
          i.certificationEventDate ===
            qaCertificationEvent.certificationEventDate &&
          i.monitoringSystemId === qaCertificationEvent.monitoringSystemId &&
          i.componentId === qaCertificationEvent.componentId &&
          i.unitId === qaCertificationEvent.unitId &&
          i.stackPipeId === qaCertificationEvent.stackPipeId
        );
      });

      if (duplicates.length > 1) {
        error = duplicateQACertEvent;
      }
    } else {
      const {
        componentRecordId,
        monitoringSystemRecordId,
      } = await this.service.lookupValues(locationId, qaCertificationEvent);

      const {
        certificationEventDate,
        certificationEventHour,
        certificationEventCode,
      } = qaCertificationEvent;

      qaCertEvents = await this.repository.findBy({
        locationId,
        certificationEventCode,
        certificationEventHour,
        certificationEventDate,
        monitoringSystemRecordId,
        componentRecordId,
      });

      if (qaCertEvents.length > 0) {
        error = duplicateQACertEvent;
      }
    }

    return error;
  }

  getErrorMessage(errorCode: string, options?: object): string {
    return CheckCatalogService.formatResultMessage(errorCode, options);
  }
}

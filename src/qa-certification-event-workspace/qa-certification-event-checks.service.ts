import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import {
  QACertificationEventBaseDTO,
  QACertificationEventImportDTO,
} from '../dto/qa-certification-event.dto';

const KEY = 'QA Certification Event';

@Injectable()
export class QACertificationEventChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(QACertificationEventWorkspaceRepository)
    private readonly repository: QACertificationEventWorkspaceRepository,
    private readonly service: QACertificationEventWorkspaceService,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
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

    this.logger.info('Running QA Certification Event Checks');

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
    this.logger.info('Completed QA Certification Event Checks');
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
      recordType: KEY,
      fieldnames:
        'locationId, qaCertEventCode, qaCertEventHour, qaCertEventDate, monitoringSystemId, componentId',
    });

    if (isImport) {
      const duplicates = qaCertificationEvents.filter(i => {
        return (
          i.qaCertEventCode === qaCertificationEvent.qaCertEventCode &&
          i.qaCertEventHour === qaCertificationEvent.qaCertEventHour &&
          i.qaCertEventDate === qaCertificationEvent.qaCertEventDate &&
          i.monitoringSystemID === qaCertificationEvent.monitoringSystemID &&
          i.componentID === qaCertificationEvent.componentID &&
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
        qaCertEventDate,
        qaCertEventHour,
        qaCertEventCode,
      } = qaCertificationEvent;

      qaCertEvents = await this.repository.find({
        locationId,
        qaCertEventCode,
        qaCertEventHour,
        qaCertEventDate,
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

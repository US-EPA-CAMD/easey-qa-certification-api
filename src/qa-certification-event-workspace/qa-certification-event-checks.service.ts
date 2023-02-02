import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { QACertificationBaseDTO } from 'src/dto/qa-certification.dto';
import { QACertificationEventImportDTO } from 'src/dto/qa-certification-event.dto';

const KEY = 'QA Certification Event';

@Injectable()
export class QACertificationEventChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(QACertificationEventWorkspaceRepository)
    private readonly repository: QACertificationEventWorkspaceRepository,
    private readonly service: QACertificationEventWorkspaceService,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    loctionId: string,
    qaCertificationEvent:
      | QACertificationBaseDTO
      | QACertificationEventImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.throwIfErrors(errorList);
    this.logger.info('Completed Test Extension Exemption Checks');
    return errorList;
  }

  getErrorMessage(errorCode: string, options?: object): string {
    return CheckCatalogService.formatResultMessage(errorCode, options);
  }
}

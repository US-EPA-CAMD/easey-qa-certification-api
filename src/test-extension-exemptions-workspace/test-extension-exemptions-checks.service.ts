import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionImportDTO,
} from 'src/dto/test-extension-exemption.dto';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

const KEY = 'Test Extension Exemption';

@Injectable()
export class TestExtensionExemptionsChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestExtensionExemptionsWorkspaceRepository)
    private readonly repository: TestExtensionExemptionsWorkspaceRepository,
    private readonly service: TestExtensionExemptionsWorkspaceService,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    locationId: string,
    testExtensionExemption:
      | TestExtensionExemptionBaseDTO
      | TestExtensionExemptionImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.logger.info('Running Test Extension Exemption Checks');

    if (!isUpdate) {
      error = await this.extexem8DuplicateCheck(
        testExtensionExemption,
        locationId,
      );
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Test Extension Exemption Checks');
    return errorList;
  }

  private async extexem8DuplicateCheck(
    testExtensionExemption:
      | TestExtensionExemptionBaseDTO
      | TestExtensionExemptionImportDTO,
    locationId: string,
  ) {
    let error = null;
    let testExtExempts = [];

    const dupeErrorMsg = this.getErrorMessage('EXTEXEM-8-A', {
      recordtype: KEY,
      fieldnames:
        'extensionOrExemptionCode, reportPeriodId, monitoringSystemId, componentId, fuelCode',
    });

    const [
      reportPeriodId,
      componentRecordId,
      monitoringSystemRecordId,
    ] = await this.service.lookupValues(locationId, testExtensionExemption);

    const { extensionOrExemptionCode, fuelCode } = testExtensionExemption;
    testExtExempts = await this.repository.find({
      reportPeriodId,
      monitoringSystemRecordId,
      componentRecordId,
      extensionOrExemptionCode,
      fuelCode,
    });

    if (testExtExempts.length > 0) {
      error = dupeErrorMsg;
    }
    return error;
  }

  getErrorMessage(errorCode: string, options?: object): string {
    return CheckCatalogService.formatResultMessage(errorCode, options);
  }
}

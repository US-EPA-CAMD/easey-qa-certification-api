import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionImportDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

const KEY = 'Test Extension Exemption';

@Injectable()
export class TestExtensionExemptionsChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TestExtensionExemptionsWorkspaceRepository,
    private readonly service: TestExtensionExemptionsWorkspaceService,
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
    testExtensionExemption:
      | TestExtensionExemptionBaseDTO
      | TestExtensionExemptionImportDTO,
    testExtensionExemptions:
      | TestExtensionExemptionBaseDTO[]
      | TestExtensionExemptionImportDTO[],
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.logger.log('Running Test Extension Exemption Checks');

    if (!isUpdate) {
      error = await this.extexem8DuplicateCheck(
        testExtensionExemption,
        testExtensionExemptions,
        locationId,
        isImport,
      );
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Test Extension Exemption Checks');
    return errorList;
  }

  private async extexem8DuplicateCheck(
    testExtensionExemption:
      | TestExtensionExemptionBaseDTO
      | TestExtensionExemptionImportDTO,
    testExtensionExemptions:
      | TestExtensionExemptionBaseDTO[]
      | TestExtensionExemptionImportDTO[],
    locationId: string,
    isImport: boolean,
  ) {
    let error = null;
    let testExtExempts = [];

    const dupeErrorMsg = this.getErrorMessage('EXTEXEM-8-A', {
      recordtype: KEY,
      fieldnames:
        'extensionOrExemptionCode, reportPeriodId, monitoringSystemId, componentId, fuelCode',
    });

    if (isImport) {
      const duplicates = testExtensionExemptions.filter(i => {
        return (
          i.year === testExtensionExemption.year &&
          i.quarter === testExtensionExemption.quarter &&
          i.extensionOrExemptionCode ===
            testExtensionExemption.extensionOrExemptionCode &&
          i.fuelCode === testExtensionExemption.fuelCode &&
          i.monitoringSystemId === testExtensionExemption.monitoringSystemId &&
          i.componentId === testExtensionExemption.componentId &&
          i.unitId === testExtensionExemption.unitId &&
          i.stackPipeId === testExtensionExemption.stackPipeId
        );
      });

      if (duplicates.length > 1) {
        error = dupeErrorMsg;
      }
    } else {
      const {
        reportPeriodId,
        componentRecordId,
        monitoringSystemRecordId,
      } = await this.service.lookupValues(locationId, testExtensionExemption);

      const { extensionOrExemptionCode, fuelCode } = testExtensionExemption;

      testExtExempts = await this.repository.findBy({
        locationId,
        reportPeriodId,
        monitoringSystemRecordId,
        componentRecordId,
        extensionOrExemptionCode,
        fuelCode,
      });

      if (testExtExempts.length > 0) {
        error = dupeErrorMsg;
      }
    }

    return error;
  }

  getErrorMessage(errorCode: string, options?: object): string {
    return CheckCatalogService.formatResultMessage(errorCode, options);
  }
}

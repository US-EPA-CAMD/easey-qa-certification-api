import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunImportDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRun } from '../entities/unit-default-test-run.entity';

import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

@Injectable()
export class UnitDefaultTestRunChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(UnitDefaultTestRunWorkspaceRepository)
    private readonly repository: UnitDefaultTestRunWorkspaceRepository,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
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
    unitDefaultTestRun: UnitDefaultTestRunBaseDTO | UnitDefaultTestRunImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
    unitDefaultTestSumId?: string,
    testSumId?: string,
    testSummary?: TestSummaryImportDTO,
    unitDefaultTestRuns?: UnitDefaultTestRunImportDTO[],
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;
    this.logger.log('Running Unit Default Test Run Checks');

    if (isImport) {
      testSumRecord = testSummary;
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.UNITDEF) {
      if (!isUpdate) {
        error = await this.duplicateTestCheck(
          unitDefaultTestSumId,
          unitDefaultTestRun,
          isImport,
          unitDefaultTestRuns,
        );
        if (error) {
          errorList.push(error);
        }
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Unit Default Test Run Checks');
    return errorList;
  }

  private async duplicateTestCheck(
    unitDefaultTestSumId: string,
    unitDefaultTestRun: UnitDefaultTestRunBaseDTO | UnitDefaultTestRunImportDTO,
    isImport: boolean = false,
    unitDefaultTestRuns: UnitDefaultTestRunImportDTO[] = [],
  ): Promise<string> {
    let error: string = null;
    let RECORDTYPE: string = 'unitDefaultTestRun';
    let FIELDNAME: string = 'OperatingLevelforRun,RunNumber';
    const errorMsg = this.getMessage('UNITDEF-29-A', {
      recordtype: RECORDTYPE,
      fieldnames: FIELDNAME,
    });

    if (isImport) {
      const duplicates = unitDefaultTestRuns.filter(
        i =>
          i.operatingLevelForRun === unitDefaultTestRun.operatingLevelForRun &&
          i.runNumber === unitDefaultTestRun.runNumber,
      );

      // UNITDEF-29 Duplicate Unit Default Test Run (Result A)
      if (duplicates.length > 1) {
        error = errorMsg;
      }
    } else {
      const record: UnitDefaultTestRun = await this.repository.findOne({
        unitDefaultTestSumId: unitDefaultTestSumId,
        operatingLevelForRun: unitDefaultTestRun.operatingLevelForRun,
        runNumber: unitDefaultTestRun.runNumber,
      });

      if (record) {
        // UNITDEF-29 Duplicate Unit Default Test Run (Result A)
        error = errorMsg;
      }
    }

    return error;
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

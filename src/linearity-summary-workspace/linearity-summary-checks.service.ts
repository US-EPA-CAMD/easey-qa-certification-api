import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  LinearitySummaryBaseDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';
import { LinearitySummary } from '../entities/linearity-summary.entity';

import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

@Injectable()
export class LinearitySummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LinearitySummaryWorkspaceRepository)
    private readonly repository: LinearitySummaryWorkspaceRepository,
    @InjectRepository(TestSummaryMasterDataRelationshipRepository)
    private readonly testSummaryMDRepository: TestSummaryMasterDataRelationshipRepository,
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
    linearitySummary: LinearitySummaryBaseDTO | LinearitySummaryImportDTO,
    testSumId: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
    linearitySummaries?: LinearitySummaryImportDTO[],
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;
    this.logger.log('Running Linearity Summary Checks');

    if (isImport) {
      testSumRecord = testSummary;
      testSumId = testSumRecord.id;
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.LINE) {
      if (!isUpdate) {
        error = await this.duplicateTestCheck(
          testSumId,
          linearitySummary,
          isImport,
          linearitySummaries,
        );
        if (error) {
          errorList.push(error);
        }
      }

      error = await this.linear15Check(linearitySummary);
      if (error) {
        errorList.push(error);
      }

      if (!isImport) {
        error = await this.linear18Check(linearitySummary.percentError);
        if (error) {
          errorList.push(error);
        }
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Linearity Summary Checks');
    return errorList;
  }

  // LINEAR-18
  private async linear18Check(percentError: number) {
    if (percentError < 0) {
      return this.getMessage('LINEAR-18-B', {
        value: percentError,
        fieldname: 'percentError',
        key: 'Linearity Summary',
      });
    }
    return null;
  }

  // LINEAR-15
  private async linear15Check(
    linearitySummary: LinearitySummaryBaseDTO | LinearitySummaryImportDTO,
  ) {
    let error: string = null;
    let FIELDNAME: string = 'gasLevelCode';

    const testSummaryMDRelationships = await this.testSummaryMDRepository.getTestTypeCodesRelationships(
      TestTypeCodes.LINE,
      'gasLevelCode',
    );

    const gasLevelCodes = testSummaryMDRelationships.map(
      summary => summary.gasLevelCode,
    );

    if (!gasLevelCodes.includes(linearitySummary.gasLevelCode)) {
      error = this.getMessage('LINEAR-15-B', { fieldname: FIELDNAME });
      //error = `You reported a [gasLevelCode] that is not in the list of valid values.`;
    }

    return error;
  }

  private async duplicateTestCheck(
    testSumId: string,
    linearitySummary: LinearitySummaryBaseDTO | LinearitySummaryImportDTO,
    isImport: boolean = false,
    linearitySummaies: LinearitySummaryImportDTO[] = [],
  ): Promise<string> {
    let error: string = null;
    let RECORDTYPE: string = 'linearitySummary';
    let FIELDNAME: string = 'gasLevelCode';

    const errorMsg = this.getMessage('LINEAR-32-A', {
      recordtype: RECORDTYPE,
      fieldnames: FIELDNAME,
    });

    if (isImport) {
      const duplicates = linearitySummaies.filter(i => {
        return i.gasLevelCode === linearitySummary.gasLevelCode;
      });

      // LINEAR-32 Duplicate Linearity Summary (Result A)
      if (duplicates.length > 1) {
        error = errorMsg;
      }
    } else {
      const record: LinearitySummary = await this.repository.findOne({
        testSumId: testSumId,
        gasLevelCode: linearitySummary.gasLevelCode,
      });

      if (record) {
        // LINEAR-32 Duplicate Linearity Summary (Result A)
        error = errorMsg;
      }
    }

    return error;
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

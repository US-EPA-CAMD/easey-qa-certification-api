import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  LinearitySummaryBaseDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';
import { LinearitySummary } from '../entities/linearity-summary.entity';

import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { TestTypeCodes } from 'src/enums/test-type-code.enum';

@Injectable()
export class LinearitySummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LinearitySummaryWorkspaceRepository)
    private readonly repository: LinearitySummaryWorkspaceRepository,
    @InjectRepository(TestSummaryMasterDataRelationshipRepository)
    private readonly testSummaryMDRepository: TestSummaryMasterDataRelationshipRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }
  }

  async runChecks(
    testSumId: string,
    linearitySummary: LinearitySummaryBaseDTO | LinearitySummaryImportDTO,
    isImport: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Linearity Summary Checks');

    error = await this.duplicateTestCheck(
      testSumId,
      linearitySummary,
      isImport,
    );
    if (error) {
      errorList.push(error);
    }

    error = await this.gasLevelCodeCheck(linearitySummary);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Linearity Summary Checks');
    return errorList;
  }

  // LINEAR-15
  private async gasLevelCodeCheck(
    linearitySummary: LinearitySummaryBaseDTO | LinearitySummaryImportDTO,
  ) {
    let error: string = null;

    const testSummaryMDRelationships = await this.testSummaryMDRepository.getTestTypeCodesRelationships(
      TestTypeCodes.LINE,
      'gasLevelCode',
    );

    const gasLevelCodes = testSummaryMDRelationships.map(
      summary => summary.gasLevelCode,
    );

    if (!gasLevelCodes.includes(linearitySummary.gasLevelCode)) {
      error = `You reported a [gasLevelCode] that is not in the list of valid values.`;
    }

    return error;
  }

  private async duplicateTestCheck(
    testSumId: string,
    linearitySummary: LinearitySummaryBaseDTO | LinearitySummaryImportDTO,
    _isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;

    const record: LinearitySummary = await this.repository.findOne({
      testSumId: testSumId,
      gasLevelCode: linearitySummary.gasLevelCode,
    });

    if (record) {
      // LINEAR-32 Duplicate Linearity Summary (Result A)
      error = `Another Linearity Summary record already exists with the same gasLevelCode [${linearitySummary.gasLevelCode}].`;
    }
    return error;
  }
}

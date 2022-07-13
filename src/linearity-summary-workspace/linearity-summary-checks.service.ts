import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  LinearitySummaryBaseDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';
import { LinearitySummary } from '../entities/linearity-summary.entity';

import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';

@Injectable()
export class LinearitySummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LinearitySummaryWorkspaceRepository)
    private readonly repository: LinearitySummaryWorkspaceRepository,
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

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Linearity Summary Checks');
    return errorList;
  }

  private async duplicateTestCheck(
    testSumId: string,
    linearitySummary: LinearitySummaryBaseDTO | LinearitySummaryImportDTO,
    _isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;

    const records: LinearitySummary[] = await this.repository.getSummariesByTestSumId(
      testSumId,
    );
    records.forEach(record => {
      if (record.gasLevelCode === linearitySummary.gasLevelCode) {
        // LINEAR-32 Duplicate Linearity Summary (Result A)
        error = `Another Linearity Summary record already exists with the same gasLevelCode [${linearitySummary.gasLevelCode}].`;
      }
    });
    return error;
  }
}

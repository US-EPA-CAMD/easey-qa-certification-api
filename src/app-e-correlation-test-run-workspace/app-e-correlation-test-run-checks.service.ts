import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunImportDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppendixETestSummaryWorkspaceRepository } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.repository';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';

@Injectable()
export class AppECorrelationTestRunChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(AppECorrelationTestRunWorkspaceRepository)
    private readonly repository: AppECorrelationTestRunWorkspaceRepository,
    @InjectRepository(AppendixETestSummaryWorkspaceRepository)
    private readonly appETestSummaryRepository: AppendixETestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    dto: AppECorrelationTestRunBaseDTO | AppECorrelationTestRunImportDTO,
    appETestRunId: string,
    appETestSumId: string,
    isImport: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.logger.info('Running Appendix E Test Run Checks');

    const appETestSummary = await this.appETestSummaryRepository.findOne(
      appETestSumId,
    );

    error = await this.appE49Check(appETestRunId, dto, appETestSummary);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Appendix E Test Summary Checks');
    return errorList;
  }

  async appE49Check(
    appETestRunId: string,
    dto: AppECorrelationTestRunBaseDTO,
    appETestSummary: AppECorrelationTestSummary,
  ) {
    let error: string = null;

    if (appETestSummary.operatingLevelForRun && dto.runNumber) {
      let duplicate = this.repository.findDuplicate(
        appETestRunId,
        appETestSummary.id,
        appETestSummary.operatingLevelForRun,
        dto.runNumber,
      );

      if (duplicate)
        error = this.getMessage('APPE-49-A', {
          recordtype: 'Appendix E Run',
          fieldnames: 'OperatingLevelForRun, RunNumber',
        });
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

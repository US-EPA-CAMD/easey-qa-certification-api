import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryImportDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

@Injectable()
export class AppECorrelationTestSummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(AppendixETestSummaryWorkspaceRepository)
    private readonly repository: AppendixETestSummaryWorkspaceRepository,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    dto:
      | AppECorrelationTestSummaryBaseDTO
      | AppECorrelationTestSummaryImportDTO,
    appETestSumId: string,
    testSumId: string,
    isImport: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.logger.info('Running Appendix E Test Summary Checks');

    error = await this.appE48Check(
      appETestSumId,
      testSumId,
      dto.operatingLevelForRun,
    );
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Appendix E Test Summary Checks');
    return errorList;
  }

  async appE48Check(appETestSumId: string, testSumId: string, opLevel: number) {
    let error: string = null;

    if (opLevel) {
      let duplicate = await this.repository.findDuplicate(
        appETestSumId,
        testSumId,
        opLevel,
      );

      if (duplicate)
        error = this.getMessage('APPE-48-A', {
          recordtype: 'Appendix E Summary',
          fieldnames: 'OperatingLevelForRun',
        });
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

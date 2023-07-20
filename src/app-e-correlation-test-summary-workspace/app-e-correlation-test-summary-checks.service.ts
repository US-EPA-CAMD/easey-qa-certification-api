import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryImportDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

@Injectable()
export class AppECorrelationTestSummaryChecksService {
  APPE_48_A_MSG;

  constructor(
    private readonly logger: Logger,
    @InjectRepository(AppendixETestSummaryWorkspaceRepository)
    private readonly repository: AppendixETestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new EaseyException(
        new Error(errorList.join('\n')),
        HttpStatus.BAD_REQUEST,
      );
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

    this.logger.log('Running Appendix E Test Summary Checks');

    error = await this.appE48Check(
      appETestSumId,
      testSumId,
      dto.operatingLevelForRun,
    );
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Appendix E Test Summary Checks');
    return errorList;
  }

  async runImportChecks(
    importDTOs: AppECorrelationTestSummaryImportDTO[],
  ): Promise<string[]> {
    let errors: string[] = [];
    let opLevelCodes = [];

    for (let dto of importDTOs) {
      if (opLevelCodes.includes(dto.operatingLevelForRun)) {
        errors = [
          this.getMessage('APPE-48-A', {
            recordtype: 'Appendix E Summary',
            fieldnames: 'OperatingLevelForRun',
          }),
        ];
      } else opLevelCodes.push(dto.operatingLevelForRun);
    }

    return errors;
  }

  async appE48Check(appETestSumId: string, testSumId: string, opLevel: number) {
    let error: string = null;

    if (opLevel != null) {
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

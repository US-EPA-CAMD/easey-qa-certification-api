import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import {
  LinearityInjectionBaseDTO,
  LinearityInjectionImportDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

@Injectable()
export class LinearityInjectionChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LinearityInjectionWorkspaceRepository)
    private readonly linearityInjectionRepository: LinearityInjectionWorkspaceRepository,
    private readonly linearitySummaryRepository: LinearitySummaryWorkspaceRepository,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    linearityInjection: LinearityInjectionBaseDTO | LinearityInjectionImportDTO,
    linSumId: string,
    testSumId: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    linearityInjections?: LinearityInjectionImportDTO[],
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;
    this.logger.info('Running Linearity Injection Checks');

    if (isImport) {
      testSumRecord = testSummary;
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.LINE) {
      if (!isUpdate) {
        error = await this.duplicateTestCheck(
          linSumId,
          linearityInjection,
          isImport,
          linearityInjections,
        );
        if (error) {
          errorList.push(error);
        }
      }
      error = await this.linear34Check(linSumId, linearityInjections, isImport);
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Linearity Injection Checks');
    return errorList;
  }

  // LINEAR-33 Duplicate Linearity Injection (Result A)
  private async duplicateTestCheck(
    linSumId: string,
    linearityInjection: LinearityInjectionBaseDTO | LinearityInjectionImportDTO,
    _isImport: boolean = false,
    linearityInjections: LinearityInjectionImportDTO[] = [],
  ): Promise<string> {
    let error: string = null;
    const RECORDTYPE: string = 'Linearity Injection';

    const duplicates = linearityInjections.filter(i => {
      return (
        i.injectionDate === linearityInjection.injectionDate,
        i.injectionHour === linearityInjection.injectionHour,
        i.injectionMinute === linearityInjection.injectionMinute
      );
    });

    // IMPORT-20 Duplicate Test Check
    if (_isImport && duplicates.length > 1) {
      error = this.getMessage('LINEAR-33-A', {
        recordtype: RECORDTYPE,
        fieldnames: [
          linearityInjection.injectionDate,
          linearityInjection.injectionHour,
          linearityInjection.injectionMinute,
        ],
      });
    }

    const record: LinearityInjection = await this.linearityInjectionRepository.findOne(
      {
        linSumId: linSumId,
        injectionDate: linearityInjection.injectionDate,
        injectionHour: linearityInjection.injectionHour,
        injectionMinute: linearityInjection.injectionMinute,
      },
    );
    if (record) {
      // LINEAR-33 Duplicate Linearity Injection (Result A)
      error = this.getMessage('LINEAR-33-A', {
        recordtype: RECORDTYPE,
        fieldnames: [
          linearityInjection.injectionDate,
          linearityInjection.injectionHour,
          linearityInjection.injectionMinute,
        ],
      });
      //error = `Another Linearity Injection record already exists with the same injectionDate [${linearityInjection.injectionDate}], injectionHour [${linearityInjection.injectionHour}], injectionMinute [${linearityInjection.injectionMinute}].`;
    }
    return error;
  }

  // LINEAR-34 Too Many Gas Injections (Result A)
  private async linear34Check(
    linSumId: string,
    linearityInjections: LinearityInjectionImportDTO[],
    isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;
    let injectionsLength: number = null;
    let KEY: string = 'Linearity Summary';

    if (isImport) {
      const injections = linearityInjections;
      injectionsLength = injections.length;
    } else {
      const linSumRecord: LinearitySummary = await this.linearitySummaryRepository.getSummaryById(
        linSumId,
      );
      injectionsLength = linSumRecord?.injections.length + 1;
    }

    if (injectionsLength > 3) {
      // LINEAR-34 Too Many Gas Injections (Result A)
      error = this.getMessage('LINEAR-34-A', { key: KEY });
      //error = `There were more than three gas injections for [Linearity Summary]. Only the last three injections at this level were retained for analysis. All other gas injections have been disregarded.`;
    }
    return error;
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

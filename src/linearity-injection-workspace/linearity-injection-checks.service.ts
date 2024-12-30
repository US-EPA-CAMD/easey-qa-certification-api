import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { IsNull } from 'typeorm';

import {
  LinearityInjectionBaseDTO,
  LinearityInjectionImportDTO,
} from '../dto/linearity-injection.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';

@Injectable()
export class LinearityInjectionChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly linearityInjectionRepository: LinearityInjectionWorkspaceRepository,
    private readonly linearitySummaryRepository: LinearitySummaryWorkspaceRepository,
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
    this.logger.log('Running Linearity Injection Checks');

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
    this.logger.log('Completed Linearity Injection Checks');
    return errorList;
  }

  // LINEAR-33 Duplicate Linearity Injection (Result A)
  private async duplicateTestCheck(
    linSumId: string,
    linearityInjection: LinearityInjectionBaseDTO | LinearityInjectionImportDTO,
    isImport: boolean = false,
    linearityInjections: LinearityInjectionImportDTO[] = [],
  ): Promise<string> {
    let error: string = null;
    const RECORDTYPE: string = 'Linearity Injection';

    const errorMsg = this.getMessage('LINEAR-33-A', {
      recordtype: RECORDTYPE,
      fieldnames: [
        linearityInjection.injectionDate,
        linearityInjection.injectionHour,
        linearityInjection.injectionMinute,
      ],
    });

    if (isImport) {
      const duplicates = linearityInjections.filter(i => {
        return (
          i.injectionDate === linearityInjection.injectionDate &&
          i.injectionHour === linearityInjection.injectionHour &&
          i.injectionMinute === linearityInjection.injectionMinute
        );
      });

      if (duplicates.length > 1) {
        // LINEAR-33 Duplicate Linearity Injection (Result A)
        error = errorMsg;
      }
    } else {
      const record: LinearityInjection = await this.linearityInjectionRepository.findOneBy(
        {
          linSumId: linSumId,
          injectionDate: linearityInjection.injectionDate,
          injectionHour: linearityInjection.injectionHour ?? IsNull(),
          injectionMinute: linearityInjection.injectionMinute,
        },
      );
      if (record) {
        // LINEAR-33 Duplicate Linearity Injection (Result A)
        error = errorMsg;
      }
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

import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { CycleTimeSummaryWorkspaceRepository } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.repository';
import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionImportDTO,
} from '../dto/cycle-time-injection.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';

@Injectable()
export class CycleTimeInjectionChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly repo: CycleTimeInjectionWorkspaceRepository,
    private readonly cycleTimeSummaryWorkspaceRepository: CycleTimeSummaryWorkspaceRepository,
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
    cycleTimeInjection: CycleTimeInjectionBaseDTO | CycleTimeInjectionImportDTO,
    cycleTimeInjectionId: string,
    cycleTimeSumId: string,
    testSumId: string,
    isImport: boolean = false,
    cycleTimeInjections?: CycleTimeInjectionImportDTO[],
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

    if (testSumRecord?.testTypeCode === TestTypeCodes.CYCLE) {
      error = await this.cycle21Check(cycleTimeInjection);
      if (error) {
        errorList.push(error);
      }
    }

    error = await this.cycle20Check(
      cycleTimeInjectionId,
      cycleTimeInjection,
      cycleTimeInjections,
      testSumRecord,
      isImport,
    );
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Linearity Injection Checks');
    return errorList;
  }

  async cycle20Check(
    cycleTimeInjectionId: string,
    dto: CycleTimeInjectionBaseDTO,
    cycleTimeInjections: CycleTimeInjectionImportDTO[],
    testSummary: TestSummary,
    isImport: boolean,
  ) {
    let error: string = null;

    const errorMsg = this.getMessage('CYCLE-20-A', {
      recordtype: 'Cycle Time Injection',
      fieldnames: 'GasLevelCode',
    });

    if (isImport) {
      const duplicates = cycleTimeInjections.filter(i => {
        return i.gasLevelCode === dto.gasLevelCode;
      });

      if (duplicates.length > 1) {
        // CYCLE-20 (Result A)
        error = errorMsg;
      }
    } else {
      const duplicate = await this.repo.findDuplicate(
        cycleTimeInjectionId,
        testSummary.id,
        dto.gasLevelCode,
      );

      if (duplicate)
        // CYCLE-20 (Result A)
        error = errorMsg;
    }

    return error;
  }

  private async cycle21Check(
    cycleTimeInjection: CycleTimeInjectionBaseDTO | CycleTimeInjectionImportDTO,
  ): Promise<string> {
    let error: string = null;
    let KEY: string = 'Cycle Time Injection';

    if (!['ZERO', 'HIGH'].includes(cycleTimeInjection.gasLevelCode)) {
      error = this.getMessage('CYCLE-21-B', {
        key: KEY,
        value: cycleTimeInjection.gasLevelCode,
        fieldname: 'gasLevelCode',
      });
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

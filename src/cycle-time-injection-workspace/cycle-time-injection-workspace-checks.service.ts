import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';
import { CycleTimeSummaryWorkspaceRepository } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.repository';
import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionImportDTO,
} from '../dto/cycle-time-injection.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import {AppEHeatInputFromGasBaseDTO} from "../dto/app-e-heat-input-from-gas.dto";
import {AppECorrelationTestRun} from "../entities/workspace/app-e-correlation-test-run.entity";
import {CycleTimeSummary} from "../entities/workspace/cycle-time-summary.entity";
import {CycleTimeInjectionWorkspaceRepository} from "./cycle-time-injection-workspace.repository";
import {TestSummary} from "../entities/workspace/test-summary.entity";

@Injectable()
export class CycleTimeInjectionChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(CycleTimeInjectionWorkspaceRepository)
    private readonly repo: CycleTimeInjectionWorkspaceRepository,
    @InjectRepository(CycleTimeSummaryWorkspaceRepository)
    private readonly cycleTimeSummaryWorkspaceRepository: CycleTimeSummaryWorkspaceRepository,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    cycleTimeInjection: CycleTimeInjectionBaseDTO | CycleTimeInjectionImportDTO,
    cycleTimeInjectionId: string,
    cycleTimeSumId: string,
    testSumId: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    cycleTimeInjections?: CycleTimeInjectionImportDTO[],
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
    if (testSumRecord.testTypeCode === TestTypeCodes.CYCLE) {
      error = await this.cycle21Check(cycleTimeInjection);
      if (error) {
        errorList.push(error);
      }
    }

    error = await this.cycle20Check(cycleTimeInjectionId, cycleTimeInjection, testSumRecord);
    if(error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Linearity Injection Checks');
    return errorList;
  }

  async cycle20Check(
      cycleTimeInjectionId: string,
      dto: CycleTimeInjectionBaseDTO,
      testSummary: TestSummary,
  ) {
    let error: string = null;

    if(dto.gasLevelCode) {
      const duplicate = await this.repo.findDuplicate(cycleTimeInjectionId,
          testSummary.id, dto.gasLevelCode);

      if(duplicate)
        error = this.getMessage('CYCLE-20-A', {
          recordtype: 'Cycle Time Injection',
          fieldnames: 'GasLevelCode',
        });
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
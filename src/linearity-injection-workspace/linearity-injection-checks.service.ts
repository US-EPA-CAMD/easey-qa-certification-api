import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import {
  LinearityInjectionBaseDTO,
  LinearityInjectionImportDTO,
  LinearityInjectionRecordDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class LinearityInjectionChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LinearityInjectionWorkspaceRepository)
    private readonly linearityInjectionRepository: LinearityInjectionWorkspaceRepository,
    private readonly linearitySummaryRepository: LinearitySummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    linSumId: string,
    linearityInjection: LinearityInjectionBaseDTO | LinearityInjectionImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
    linearityInjections?: LinearityInjectionImportDTO[],
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Linearity Injection Checks');

    if (!isUpdate) {
      error = await this.duplicateTestCheck(
        linSumId,
        linearityInjection,
        isImport,
      );
      if (error) {
        errorList.push(error);
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
  ): Promise<string> {
    let error: string = null;
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
      error = `Another Linearity Injection record already exists with the same injectionDate [${linearityInjection.injectionDate}], injectionHour [${linearityInjection.injectionHour}], injectionMinute [${linearityInjection.injectionMinute}].`;
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
      error = `There were more than three gas injections for [Linearity Summary]. Only the last three injections at this level were retained for analysis. All other gas injections have been disregarded.`;
    }
    return error;
  }
}

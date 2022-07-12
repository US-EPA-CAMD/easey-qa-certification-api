import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryImportDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import {
  LinearityInjectionBaseDTO,
  LinearityInjectionImportDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';

@Injectable()
export class LinearityInjectionChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LinearityInjectionWorkspaceRepository)
    private readonly linearityInjectionRepository: LinearityInjectionWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }
  }

  async runChecks(
    linSumId: string,
    linearityInjection: LinearityInjectionBaseDTO | LinearityInjectionImportDTO,
    isImport: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Linearity Injection Checks');

    error = await this.duplicateTestCheck(
      linSumId,
      linearityInjection,
      isImport,
    );
    if (error) errorList.push(error);

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Linearity Injection Checks');
    return errorList;
  }

  private async duplicateTestCheck(
    linSumId: string,
    linearityInjection: LinearityInjectionBaseDTO | LinearityInjectionImportDTO,
    _isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;
    let records: LinearityInjection[];

    records = await this.linearityInjectionRepository.getInjectionsByLinSumId(
      linSumId,
    );
    records.forEach(record => {
      if (
        record.injectionDate.toDateString() ===
          linearityInjection.injectionDate.toDateString() &&
        record.injectionHour === linearityInjection.injectionHour &&
        record.injectionMinute === linearityInjection.injectionMinute
      ) {
        console.log('IF condition matches');
        // LINEAR-33 Duplicate Linearity Injection (Result A)
        error = `Another Linearity Injection record already exists with the same injectionDate [${linearityInjection.injectionDate}], injectionHour [${linearityInjection.injectionHour}], injectionMinute [${linearityInjection.injectionMinute}].`;
      }
    });
    console.log(error);
    return error;
  }
}

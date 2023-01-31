import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionImportDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { CycleTimeSummaryWorkspaceRepository } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.repository';

@Injectable()
export class CycleTimeInjectionChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(CycleTimeInjectionWorkspaceRepository)
    private readonly repo: CycleTimeInjectionWorkspaceRepository,
    @InjectRepository(CycleTimeSummaryWorkspaceRepository)
    private readonly cycleTimeSummaryRepo: CycleTimeSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    dto: CycleTimeInjectionBaseDTO | CycleTimeInjectionImportDTO,
    cycleTimeInjectionId: string,
    cycleTimeSumId: string,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.logger.info('Running Cycle Time Injection Checks');

    const cycleTimeSummary = await this.cycleTimeSummaryRepo.findOneWithAncestors(
      cycleTimeSumId,
    );

    error = await this.cycle20Check(
      cycleTimeInjectionId,
      dto,
      cycleTimeSummary,
    );
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Cycle Time Injection Checks');
    return errorList;
  }

  async cycle20Check(
    cycleTimeInjectionId: string,
    dto: CycleTimeInjectionBaseDTO,
    cycleTimeSummary: CycleTimeSummary,
  ) {
    let error: string = null;
    let testSummary = cycleTimeSummary.testSummary;

    if (dto.gasLevelCode) {
      const duplicate = await this.repo.findDuplicate(
        cycleTimeInjectionId,
        testSummary.id,
        dto.gasLevelCode,
      );

      if (duplicate)
        error = this.getMessage('CYCLE-20-A', {
          recordtype: 'Cycle Time Injection',
          fieldnames: 'GasLevelCode',
        });
    }

    return error;
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

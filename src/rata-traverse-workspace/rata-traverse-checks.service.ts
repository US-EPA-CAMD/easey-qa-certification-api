import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import {
  RataTraverseBaseDTO,
  RataTraverseImportDTO,
} from 'src/dto/rata-traverse.dto';

const KEY = 'RATA Traverse';

@Injectable()
export class RataTraverseChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitorSystemRepository: MonitorSystemRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }

  async runChecks(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    locationId: string,
    testSumId?: string,
    testSummary?: TestSummaryImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.info('Running RATA Traverse Checks');

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOne({
        monitoringSystemID: testSummary.monitoringSystemID,
        locationId: locationId,
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      error = this.rata76Check(rataTraverse);
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed RATA Traverse Checks');
    return errorList;
  }

  private rata76Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
  ): string {
    let error = null;

    if (
      rataTraverse.avgVelDiffPressure === null &&
      rataTraverse.avgSquareVelDiffPressure === null
    ) {
      error = this.getMessage('RATA-76-A', {
        key: KEY,
      });
    }

    if (
      rataTraverse.avgVelDiffPressure !== null &&
      rataTraverse.avgSquareVelDiffPressure !== null
    ) {
      error = this.getMessage('RATA-76-B', {
        key: KEY,
      });
    }

    return error;
  }
}

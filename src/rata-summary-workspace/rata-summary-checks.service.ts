import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import {
  RataSummaryBaseDTO,
  RataSummaryImportDTO,
} from '../dto/rata-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

const KEY = 'RATA Summary';

@Injectable()
export class RataSummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitoringSystemRepository: MonitorSystemRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    locationId: string,
    rataSummary: RataSummaryBaseDTO | RataSummaryImportDTO,
    testSumId?: string,
    testSummary?: TestSummaryImportDTO,
    isImport: boolean = false,
    _isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;
    this.logger.info('Running Rata Summary Checks');

    if (isImport) {
      testSumRecord = testSummary;

      testSumRecord.system = await this.monitoringSystemRepository.findOne({
        monitoringSystemID: testSummary.monitoringSystemID,
        locationId: locationId,
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    // RATA-17 Mean CEM Value Valid
    error = this.rata17Check(testSumRecord, rataSummary.meanCEMValue);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed RATA Summary Checks');
    return errorList;
  }

  private rata17Check(
    testSumRecord: TestSummary,
    meanCEMValue: number,
  ): string {
    let error: string = null;

    if (testSumRecord.system?.systemTypeCode === 'HG' && meanCEMValue === 0) {
      error = `[RATA-17-C] You reported a [meanCEMValue] of zero for [${KEY}]`;
    }

    if (meanCEMValue < 0) {
      error = `[RATA-17-B] You defined an invalid [meanCEMValue] for [${KEY}]. This value must be greater than zero and less than 20,000.`;
    }

    return error;
  }
}
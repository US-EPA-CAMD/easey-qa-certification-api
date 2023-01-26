import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummary } from '../entities/workspace/test-summary.entity';
import {
  ProtocolGasBaseDTO,
  ProtocolGasImportDTO,
} from '../dto/protocol-gas.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

const KEY = 'Protocol Gas';

@Injectable()
export class ProtocolGasChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitorSystemRepository: MonitorSystemRepository,
  ) {}

  private throwIfErrrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    protocolGas: ProtocolGasBaseDTO | ProtocolGasImportDTO,
    locationId: string,
    testSumId?: string,
    testSummary?: TestSummaryImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let errorList: string[] = [];
    let error: string;
    let testSumRecord;

    this.logger.info('Running Protocol Gas Checks');

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOne({
        where: {
          monitoringSystemID: testSummary.monitoringSystemID,
          locationId,
        },
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    // PGVP-8
    error = this.pgvp8Check(testSumRecord);
    if (error) {
      errorList.push(error);
    }

    // PGVP-9
    error = this.pgvp9Check(protocolGas.gasTypeCode, testSummary.testTypeCode);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrrors(errorList);
    this.logger.info('Completed Protocol Gas Checks');
    return errorList;
  }

  private pgvp8Check(testSumRecord: TestSummary): string {
    let error: string = null;

    if (testSumRecord.system?.systemTypeCode === 'FLOW') {
      error = CheckCatalogService.formatResultMessage('PGVP-8-A');
    }

    return error;
  }

  private pgvp9Check(gasTypeCode: string, testTypeCode: string): string {
    let error: string = null;

    if (gasTypeCode === 'ZERO') {
      if (!['RATA', 'APPE', 'UNITDEF'].includes(testTypeCode)) {
        error = CheckCatalogService.formatResultMessage('PGVP-9-F');
      }
    } else {
      if (!['GMIS', 'PRM', 'RGM', 'SRM'].includes(gasTypeCode)) {
        if (gasTypeCode === 'ZAM') {
          error = CheckCatalogService.formatResultMessage('PGVP-9-B');
        }

        if (gasTypeCode === 'APPVD') {
          error = CheckCatalogService.formatResultMessage('PGVP-9-C');
        }
      }
    }

    return error;
  }
}

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
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';

const KEY = 'Protocol Gas';

@Injectable()
export class ProtocolGasChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitorSystemRepository: MonitorSystemRepository,
    @InjectRepository(GasComponentCodeRepository)
    private readonly gasComponentCodeRepository: GasComponentCodeRepository,
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
    error = this.pgvp9Check(
      protocolGas.gasTypeCode,
      testSumRecord.testTypeCode,
    );
    if (error) {
      errorList.push(error);
    }

    // PGVP-12 and PGVP-13
    const errors = await this.pgvp12and13Checks(
      protocolGas.gasTypeCode,
      testSumRecord.testTypeCode,
    );
    if (errors.length > 0) {
      errorList.push(...errors);
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

  private async pgvp12and13Checks(
    gasTypeCode: string,
    testTypeCode: string,
  ): Promise<string[]> {
    let error: string;
    let errorList: string[] = [];

    let pgApprovalRequested = false;
    const pgInvalidComponentList = [];
    const pgExclusiveComponentList = [];
    const pgBalanceComponentList = [];
    const pgDuplicateComponentList = [];
    const pgComponentList = [];
    let containsZERO = false;

    const gasComponents = await this.gasComponentCodeRepository.find();

    if (gasTypeCode) {
      const gasTypeCodes = gasTypeCode.split(',');

      const gasComponentCodes = gasComponents.map(gc => gc.gasComponentCode);

      gasTypeCodes.forEach(el => {
        const found = gasComponentCodes.includes(el);

        if (!found) {
          pgInvalidComponentList.push(el);
        }

        if (found) {
          const filteredGasComponent = gasComponents.find(
            gc => el === gc.gasComponentCode,
          );

          if (filteredGasComponent.canCombineIndicator === 0) {
            pgExclusiveComponentList.push(el);
          }

          if (filteredGasComponent.balanceComponentIndicator === 1) {
            pgBalanceComponentList.push(el);
          }
        }

        if (el === 'APPVD') {
          pgApprovalRequested = true;
        }

        if (el === 'ZERO') {
          containsZERO = true;
        }

        if (!pgComponentList.includes(el)) {
          pgComponentList.push(el);
        } else {
          pgDuplicateComponentList.push(el);
        }

        // pgvp-13
        if (pgInvalidComponentList.length === 0 && !pgApprovalRequested) {
          if (!['GMIS', 'NTRM', 'PRM', 'RGM', 'SRM', 'ZERO'].includes(el)) {
            if (['SO2, CO2'].includes(el)) {
              if (!found) {
                error = CheckCatalogService.formatResultMessage('PGVP-13-A');
                errorList.push(error);
              }
            }

            if (el === 'O2') {
              if (gasTypeCode !== 'AIR' && !gasTypeCodes.includes('O2')) {
                error = CheckCatalogService.formatResultMessage('PGVP-13-B');
                errorList.push(error);
              }
            }

            if ((testTypeCode === 'LINE' && el === 'NOX') || el === 'NOXC') {
              if (['NO', 'NO2', 'NOX'].includes(el)) {
                error = CheckCatalogService.formatResultMessage('PGVP-13-C');
                errorList.push(error);
              }
            }

            if (
              ['RATA', 'APPE', 'UNITDEF'].includes(testTypeCode) &&
              ['NOX', 'NOXP'].includes(el)
            ) {
              if (
                gasTypeCode !== 'AIR' &&
                ['CO2', 'NO', 'NO2', 'O2'].includes(el)
              ) {
                error = CheckCatalogService.formatResultMessage('PGVP-13-D');
                errorList.push(error);
              }
            }
          }
        }
      });
    }

    if (pgInvalidComponentList.length > 0) {
      error = CheckCatalogService.formatResultMessage('PGVP-12-B', {
        invalidlist: pgInvalidComponentList,
        fieldname: 'gasTypeCode',
        key: KEY,
      });
      errorList.push(error);
    }

    if (pgDuplicateComponentList.length > 0) {
      error = CheckCatalogService.formatResultMessage('PGVP-12-H');
      errorList.push(error);
    }

    if (pgExclusiveComponentList.length > 1) {
      error = CheckCatalogService.formatResultMessage('PGVP-12-C', {
        exclusivelist: pgExclusiveComponentList,
        fieldname: 'gasTypeCode',
        key: KEY,
      });
      errorList.push(error);
    }

    if (containsZERO && !['RATA', 'APPE', 'UNITDEF'].includes(testTypeCode)) {
      error = CheckCatalogService.formatResultMessage('PGVP-12-D');
      errorList.push(error);
    }

    if (pgApprovalRequested) {
      error = CheckCatalogService.formatResultMessage('PGVP-12-E', {
        fieldname: 'gasTypeCode',
        key: KEY,
      });
      errorList.push(error);
    }

    if (
      pgExclusiveComponentList.length === 0 &&
      pgBalanceComponentList.length === 0
    ) {
      error = CheckCatalogService.formatResultMessage('PGVP-12-F');
      errorList.push(error);
    }

    if (
      pgExclusiveComponentList.length === 0 &&
      pgBalanceComponentList.length > 1
    ) {
      error = CheckCatalogService.formatResultMessage('PGVP-12-G', {
        balancelist: pgBalanceComponentList,
      });
      errorList.push(error);
    }

    return errorList;
  }
}

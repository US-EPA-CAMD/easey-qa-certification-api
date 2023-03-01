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
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';
import { CrossCheckCatalogValueRepository } from '../cross-check-catalog-value/cross-check-catalog-value.repository';

const KEY = 'Protocol Gas';
const GAS_TYPE_CODE_FIELDNAME = 'gasTypeCode';

@Injectable()
export class ProtocolGasChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly monitorSystemWorkspaceRepository: MonitorSystemWorkspaceRepository,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentWorkspaceRepository: ComponentWorkspaceRepository,
    @InjectRepository(GasComponentCodeRepository)
    private readonly gasComponentCodeRepository: GasComponentCodeRepository,
    @InjectRepository(CrossCheckCatalogValueRepository)
    private readonly crossCheckCatalogValueRepository: CrossCheckCatalogValueRepository,
  ) {}

  protocolGasParameter: string = null;

  private throwIfErrrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    protocolGas: ProtocolGasBaseDTO | ProtocolGasImportDTO,
    locationId: string,
    testSumId?: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let errorList: string[] = [];
    let error: string;
    let testSumRecord;

    this.logger.info('Running Protocol Gas Checks');

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemWorkspaceRepository.findOne(
        {
          where: {
            monitoringSystemID: testSummary.monitoringSystemID,
            locationId,
          },
        },
      );
      testSumRecord.component = await this.componentWorkspaceRepository.findOne(
        {
          where: {
            componentID: testSummary.componentID,
            locationId,
          },
        },
      );
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

    this.protocolGasParameter =
      testSumRecord.component?.componentTypeCode || null;

    if (testSumRecord.testTypeCode === 'RATA') {
      if (testSumRecord.system?.systemTypeCode === 'FLOW') {
        error = this.getMessage('PGVP-8-A', {
          key: KEY,
        });
      } else {
        this.protocolGasParameter = testSumRecord.system?.systemTypeCode;
      }
    }

    if (['APPE', 'UNITDEF'].includes(testSumRecord.testTypeCode)) {
      this.protocolGasParameter = 'NOX';
    }

    return error;
  }

  private async pgvp12and13Checks(
    gasTypeCode: string,
    testTypeCode: string,
  ): Promise<string[]> {
    let error: string;
    let errorList: string[] = [];

    const pgInvalidComponentList = [];
    const pgExclusiveComponentList = [];
    const pgBalanceComponentList = [];
    const pgDuplicateComponentList = [];
    const pgComponentList = [];
    let pgComponentCount = 0;
    let balanceComponentCount = 0;
    let pgApprovalRequested = false;
    let containsZERO = false;

    const gasComponents = await this.gasComponentCodeRepository.find();

    const protocolGasParameters = await this.crossCheckCatalogValueRepository.getParameterAndTypes(
      'Protocol Gas Parameter to Type',
      this.protocolGasParameter,
    );

    let pgParameterGasTypeCodes: string[];

    if (protocolGasParameters) {
      pgParameterGasTypeCodes = protocolGasParameters.value2.split(',');
    }

    if (this.protocolGasParameter) {
      if (gasTypeCode) {
        const gasTypeCodes = gasTypeCode.split(',');

        const gasComponentCodes = gasComponents.map(gc => gc.gasComponentCode);

        let gcCodeFromGasType: string;

        gasTypeCodes.forEach(el => {
          gcCodeFromGasType = el.trim();
          const found = gasComponentCodes.includes(gcCodeFromGasType);

          if (!found) {
            pgInvalidComponentList.push(gcCodeFromGasType);
          }

          if (found) {
            const filteredGasComponent = gasComponents.find(
              gc => gcCodeFromGasType === gc.gasComponentCode,
            );

            if (filteredGasComponent.canCombineIndicator === 0) {
              pgExclusiveComponentList.push(gcCodeFromGasType);
            }

            if (filteredGasComponent.balanceComponentIndicator === 1) {
              pgBalanceComponentList.push(gcCodeFromGasType);
              balanceComponentCount += 1;
            }
          }

          if (gcCodeFromGasType === 'APPVD') {
            pgApprovalRequested = true;
          }

          if (gcCodeFromGasType === 'ZERO') {
            containsZERO = true;
          }

          if (!pgComponentList.includes(gcCodeFromGasType)) {
            pgComponentList.push(gcCodeFromGasType);
          } else {
            pgDuplicateComponentList.push(gcCodeFromGasType);
          }

          pgComponentCount += 1;

          // PGVP-13
          if (pgInvalidComponentList.length === 0 && !pgApprovalRequested) {
            if (
              !['GMIS', 'NTRM', 'PRM', 'RGM', 'SRM', 'ZERO'].includes(
                gcCodeFromGasType,
              )
            ) {
              if (['SO2', 'CO2'].includes(this.protocolGasParameter)) {
                if (
                  !pgParameterGasTypeCodes.includes(this.protocolGasParameter)
                ) {
                  error = this.getMessage('PGVP-13-A');
                  errorList.push(error);
                }
              }

              if (this.protocolGasParameter === 'O2') {
                if (
                  gasTypeCode !== 'AIR' &&
                  !pgParameterGasTypeCodes.includes('O2')
                ) {
                  error = this.getMessage('PGVP-13-B');
                  errorList.push(error);
                }
              }

              if (
                (testTypeCode === 'LINE' &&
                  this.protocolGasParameter === 'NOX') ||
                this.protocolGasParameter === 'NOXC'
              ) {
                if (!['NO', 'NO2', 'NOX'].includes(gcCodeFromGasType)) {
                  error = this.getMessage('PGVP-13-C');
                  errorList.push(error);
                }
              }

              if (
                ['RATA', 'APPE', 'UNITDEF'].includes(testTypeCode) &&
                ['NOX', 'NOXP'].includes(this.protocolGasParameter)
              ) {
                let found = false;
                const requiredCodes = ['CO2', 'NO', 'NO2', 'NOX', '02'];
                requiredCodes.forEach(code => {
                  if (!pgParameterGasTypeCodes.includes(code)) {
                    found = true;
                  }
                });
                if (gasTypeCode !== 'AIR' && found) {
                  error = this.getMessage('PGVP-13-D');
                  errorList.push(error);
                }
              }
            }
          }
        });
      }

      if (pgInvalidComponentList.length > 0) {
        error = this.getMessage('PGVP-12-B', {
          invalidlist: pgInvalidComponentList,
          fieldname: GAS_TYPE_CODE_FIELDNAME,
          key: KEY,
        });
        errorList.push(error);
      }

      if (pgDuplicateComponentList.length > 0) {
        error = this.getMessage('PGVP-12-H');
        errorList.push(error);
      }

      if (pgExclusiveComponentList.length > 0 && pgComponentCount > 1) {
        error = this.getMessage('PGVP-12-C', {
          exclusivelist: pgExclusiveComponentList,
          fieldname: GAS_TYPE_CODE_FIELDNAME,
          key: KEY,
        });
        errorList.push(error);
      }

      if (containsZERO && !['RATA', 'APPE', 'UNITDEF'].includes(testTypeCode)) {
        error = this.getMessage('PGVP-12-D');
        errorList.push(error);
      }

      if (pgApprovalRequested) {
        error = this.getMessage('PGVP-12-E', {
          fieldname: GAS_TYPE_CODE_FIELDNAME,
          key: KEY,
        });
        errorList.push(error);
      }

      if (
        pgExclusiveComponentList.length === 0 &&
        balanceComponentCount === 0
      ) {
        error = this.getMessage('PGVP-12-F');
        errorList.push(error);
      }

      if (
        pgExclusiveComponentList.length === 0 &&
        pgBalanceComponentList.length > 1
      ) {
        error = this.getMessage('PGVP-12-G', {
          balancelist: pgBalanceComponentList,
        });
        errorList.push(error);
      }
    }

    return errorList;
  }

  getMessage(messageKey: string, messageArgs?: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

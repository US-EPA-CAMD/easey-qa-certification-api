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

    // PGVP-8, PGVP-12 and PGVP-13
    const errors = await this.pgvp8andpgvp12and13Checks(
      protocolGas.gasTypeCode,
      testSumRecord,
    );
    if (errors.length > 0) {
      errorList.push(...errors);
    }

    this.throwIfErrrors(errorList);
    this.logger.info('Completed Protocol Gas Checks');
    return errorList;
  }

  private async pgvp8andpgvp12and13Checks(
    gasTypeCode: string,
    testSumRecord: TestSummary,
  ): Promise<string[]> {
    let error: string;
    let errorList: string[] = [];

    // PGVP-9
    let protocolGasParameter = null;

    if (testSumRecord.testTypeCode === 'RATA') {
      if (testSumRecord.system?.systemTypeCode === 'FLOW') {
        error = this.getMessage('PGVP-8-A', {
          key: KEY,
        });
      } else {
        protocolGasParameter = testSumRecord.system?.systemTypeCode || null;
      }
    } else if (['APPE', 'UNITDEF'].includes(testSumRecord.testTypeCode)) {
      protocolGasParameter = 'NOX';
    } else {
      protocolGasParameter = testSumRecord.component?.componentTypeCode || null;
    }

    let pgApprovalRequested,
      pgInvalidComponentList,
      pgExclusiveComponentList,
      pgBalanceComponentList,
      pgDuplicateComponentList,
      pgComponentList,
      pgComponentListValid = false,
      pgComponentCount,
      balanceComponentCount,
      containsZERO;

    const gasComponents = await this.gasComponentCodeRepository.find();

    // PGVP-12
    if (!gasTypeCode) {
      pgApprovalRequested = false;
      pgComponentListValid = false;

      error = this.getMessage('PGVP-12-A', {
        fieldname: 'gasTypeCode',
        key: KEY,
      });
    } else {
      pgApprovalRequested = false;
      pgInvalidComponentList = [];
      pgExclusiveComponentList = [];
      pgBalanceComponentList = [];
      pgDuplicateComponentList = [];

      pgComponentList = [];
      pgComponentCount = 0;
      containsZERO = false;
      balanceComponentCount = 0;

      const gasTypeCodes = gasTypeCode.split(',');

      let gcCodeFromGasType: string;
      gasTypeCodes.forEach(async el => {
        gcCodeFromGasType = el.trim();

        const filteredGasComponent = gasComponents.find(gc => {
          return gc.gasComponentCode === gcCodeFromGasType;
        });

        if (!filteredGasComponent) {
          pgInvalidComponentList.push(gcCodeFromGasType);
        } else {
          if (filteredGasComponent?.canCombineIndicator === 0) {
            pgExclusiveComponentList.push(gcCodeFromGasType);
          }

          if (filteredGasComponent?.balanceComponentIndicator === 1) {
            pgBalanceComponentList.push(gcCodeFromGasType);
            balanceComponentCount += 1;
          }
        }

        if (gcCodeFromGasType === 'APPVD') {
          pgApprovalRequested = true;
        } else if (gcCodeFromGasType === 'ZERO') {
          containsZERO = true;
        }

        if (!pgComponentList.includes(gcCodeFromGasType)) {
          pgComponentList.push(gcCodeFromGasType);
        } else if (!pgDuplicateComponentList.includes(gcCodeFromGasType)) {
          pgDuplicateComponentList.push(gcCodeFromGasType);
        }
        pgComponentCount += 1;

        if (pgInvalidComponentList.length > 0) {
          pgComponentListValid = false;
          error = this.getMessage('PGVP-12-B', {
            invalidlist: pgInvalidComponentList,
            fieldname: GAS_TYPE_CODE_FIELDNAME,
            key: KEY,
          });
          errorList.push(error);
        } else if (pgDuplicateComponentList.length > 0) {
          pgComponentListValid = false;
          error = this.getMessage('PGVP-12-H');
          errorList.push(error);
        } else if (
          pgExclusiveComponentList.length > 0 &&
          pgComponentCount > 1
        ) {
          pgComponentListValid = false;
          error = this.getMessage('PGVP-12-C', {
            exclusivelist: pgExclusiveComponentList,
            fieldname: GAS_TYPE_CODE_FIELDNAME,
            key: KEY,
          });
          errorList.push(error);
        } else if (
          containsZERO &&
          !['RATA', 'APPE', 'UNITDEF'].includes(testSumRecord.testTypeCode)
        ) {
          pgComponentListValid = false;
          error = this.getMessage('PGVP-12-D');
          errorList.push(error);
        } else if (pgApprovalRequested) {
          pgComponentListValid = false;
          error = this.getMessage('PGVP-12-E', {
            fieldname: GAS_TYPE_CODE_FIELDNAME,
            key: KEY,
          });
          errorList.push(error);
        } else if (
          pgExclusiveComponentList.length === 0 &&
          balanceComponentCount === 0
        ) {
          pgComponentListValid = false;
          error = this.getMessage('PGVP-12-F');
          errorList.push(error);
        } else if (
          pgExclusiveComponentList.length === 0 &&
          pgBalanceComponentList.length > 1
        ) {
          pgComponentListValid = false;
          error = this.getMessage('PGVP-12-G', {
            balancelist: pgBalanceComponentList,
          });
          errorList.push(error);
        } else {
          pgComponentListValid = true;
        }

        // PGVP-13

        const protocolGasParameters = await this.crossCheckCatalogValueRepository.getParameterAndTypes(
          'Protocol Gas Parameter to Type',
          protocolGasParameter,
        );

        let pgParameterGasTypeCodes: string[];

        if (protocolGasParameters) {
          pgParameterGasTypeCodes = protocolGasParameters.value2.split(',');
        }

        if (protocolGasParameter) {
          if (pgComponentListValid && !pgApprovalRequested) {
            if (
              !['GMIS', 'NTRM', 'PRM', 'RGM', 'SRM', 'ZERO'].includes(
                gcCodeFromGasType,
              )
            ) {
              if (
                ['SO2', 'CO2'].includes(protocolGasParameter) &&
                !pgParameterGasTypeCodes.includes(protocolGasParameter)
              ) {
                error = this.getMessage('PGVP-13-A');
                errorList.push(error);
              } else if (
                protocolGasParameter === 'O2' &&
                gasTypeCode !== 'AIR' &&
                !pgParameterGasTypeCodes.includes('O2')
              ) {
                error = this.getMessage('PGVP-13-B');
                errorList.push(error);
              } else if (
                (testSumRecord.testTypeCode === 'LINE' &&
                  protocolGasParameter === 'NOX') ||
                protocolGasParameter === 'NOXC'
              ) {
                if (!['NO', 'NO2', 'NOX'].includes(gcCodeFromGasType)) {
                  error = this.getMessage('PGVP-13-C');
                  errorList.push(error);
                }
              } else if (
                ['RATA', 'APPE', 'UNITDEF'].includes(
                  testSumRecord.testTypeCode,
                ) &&
                ['NOX', 'NOXP'].includes(protocolGasParameter)
              ) {
                let found = false;
                const requiredCodes = ['CO2', 'NO', 'NO2', 'NOX', 'O2'];
                requiredCodes.forEach(code => {
                  if (pgParameterGasTypeCodes.includes(code)) {
                    found = true;
                  }
                });
                if (gasTypeCode !== 'AIR' && !found) {
                  error = this.getMessage('PGVP-13-D');
                  errorList.push(error);
                }
              }
            }
          }
        }
      });
    }

    return errorList;
  }

  getMessage(messageKey: string, messageArgs?: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

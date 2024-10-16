import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import {
  ProtocolGasBaseDTO,
  ProtocolGasImportDTO,
} from '../dto/protocol-gas.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

const KEY = 'Protocol Gas';
const GAS_TYPE_CODE_FIELDNAME = 'gasTypeCode';

@Injectable()
export class ProtocolGasChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    private readonly monitorSystemWorkspaceRepository: MonitorSystemWorkspaceRepository,
    private readonly componentWorkspaceRepository: ComponentWorkspaceRepository,
    private readonly gasComponentCodeRepository: GasComponentCodeRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new EaseyException(
        new Error(errorList.join('\n')),
        HttpStatus.BAD_REQUEST,
        { responseObject: errorList },
      );
    }
  }

  async runChecks(
    protocolGas: ProtocolGasBaseDTO | ProtocolGasImportDTO,
    locationId: string,
    testSumId?: string,
    isImport: boolean = false,
    _isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let errorList: string[] = [];
    let testSumRecord;

    this.logger.log('Running Protocol Gas Checks');

    if (isImport) {
      testSumRecord = testSummary;
      if (testSummary.monitoringSystemId) {
        testSumRecord.system = await this.monitorSystemWorkspaceRepository.findOne(
          {
            where: {
              monitoringSystemID: testSummary.monitoringSystemId,
              locationId,
            },
          },
        );
      }
      if (testSummary.componentId) {
        testSumRecord.component = await this.componentWorkspaceRepository.findOne(
          {
            where: {
              componentID: testSummary.componentId,
              locationId,
            },
          },
        );
      }
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    // PGVP-8, PGVP-12 and PGVP-13
    const errors = await this.pgvp8andpgvp12and13Checks(
      protocolGas.gasTypeCode,
      testSumRecord,
      isImport,
    );
    if (errors.length > 0) {
      errorList.push(...errors);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Protocol Gas Checks');
    return errorList;
  }

  private async pgvp8andpgvp12and13Checks(
    gasTypeCode: string,
    testSumRecord: TestSummary,
    isImport: boolean = false,
  ): Promise<string[]> {
    let error: string;
    let errorList: string[] = [];
    let errorCodes = [];

    // PGVP-8
    let protocolGasParameter = null;

    if (testSumRecord.testTypeCode === 'RATA') {
      if (testSumRecord.system?.systemTypeCode === 'FLOW') {
        error = this.getMessage('PGVP-8-A', {
          key: KEY,
        });
        errorList.push(error);
        return errorList;
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

    if (protocolGasParameter) {
      // PGVP-12
      if (!gasTypeCode) {
        pgApprovalRequested = false;
        pgComponentListValid = false;

        error = this.getMessage('PGVP-12-A', {
          fieldname: 'gasTypeCode',
          key: KEY,
        });
        errorList.push(error);
        return errorList;
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

        let gasTypeCodes = gasTypeCode.includes(',')
          ? gasTypeCode.split(',')
          : [gasTypeCode];

        const gasComponents = await this.gasComponentCodeRepository.find();

        gasTypeCodes.forEach(gcCodeFromGasType => {
          const filteredGasComponent = gasComponents.find(gc => {
            if (!isImport) {
              return (
                gc.gasComponentCode === gcCodeFromGasType &&
                gc.groupCode === 'GCC'
              );
            } else {
              return gc.gasComponentCode === gcCodeFromGasType;
            }
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
        });

        if (pgInvalidComponentList.length > 0) {
          pgComponentListValid = false;
          errorCodes.push({
            code: 'PGVP-12-B',
            options: {
              invalidlist: pgInvalidComponentList,
              fieldname: GAS_TYPE_CODE_FIELDNAME,
              key: KEY,
            },
          });
        } else if (pgDuplicateComponentList.length > 0) {
          pgComponentListValid = false;
          errorCodes.push({
            code: 'PGVP-12-H',
          });
        } else if (
          pgExclusiveComponentList.length > 0 &&
          pgComponentCount > 1
        ) {
          pgComponentListValid = false;
          errorCodes.push({
            code: 'PGVP-12-C',
            options: {
              exclusivelist: pgExclusiveComponentList,
              fieldname: GAS_TYPE_CODE_FIELDNAME,
              key: KEY,
            },
          });
        } else if (
          containsZERO &&
          !['RATA', 'APPE', 'UNITDEF'].includes(testSumRecord.testTypeCode)
        ) {
          pgComponentListValid = false;
          errorCodes.push({ code: 'PGVP-12-D' });
        } else if (pgApprovalRequested) {
          pgComponentListValid = false;
          errorCodes.push({
            code: 'PGVP-12-E',
            options: {
              fieldname: GAS_TYPE_CODE_FIELDNAME,
              key: KEY,
            },
          });
        } else if (
          pgExclusiveComponentList.length === 0 &&
          balanceComponentCount === 0
        ) {
          pgComponentListValid = false;
          errorCodes.push({ code: 'PGVP-12-F' });
        } else if (
          pgExclusiveComponentList.length === 0 &&
          balanceComponentCount > 1
        ) {
          pgComponentListValid = false;
          errorCodes.push({
            code: 'PGVP-12-G',
            options: {
              balancelist: pgBalanceComponentList,
            },
          });
        } else {
          pgComponentListValid = true;
        }

        // PGVP-13
        if (pgComponentListValid && !pgApprovalRequested) {
          gasTypeCodes.forEach(gtc => {
            if (!['GMIS', 'NTRM', 'PRM', 'RGM', 'SRM', 'ZERO'].includes(gtc)) {
              if (
                ['SO2', 'CO2'].includes(protocolGasParameter) &&
                !gasTypeCodes.includes(protocolGasParameter)
              ) {
                errorCodes.push({ code: 'PGVP-13-A' });
              } else if (
                protocolGasParameter === 'O2' &&
                gtc !== 'AIR' &&
                !gasTypeCodes.includes('O2')
              ) {
                errorCodes.push({ code: 'PGVP-13-B' });
              } else if (
                testSumRecord.testTypeCode === 'LINE' &&
                ['NOX', 'NOXC'].includes(protocolGasParameter)
              ) {
                if (
                  !gasTypeCodes.some(cd => ['NO', 'NO2', 'NOX'].includes(cd))
                ) {
                  errorCodes.push({ code: 'PGVP-13-C' });
                }
              } else if (
                ['RATA', 'APPE', 'UNITDEF'].includes(
                  testSumRecord.testTypeCode,
                ) &&
                ['NOX', 'NOXP'].includes(protocolGasParameter)
              ) {
                const requiredCodes = ['CO2', 'NO', 'NO2', 'NOX', 'O2'];
                if (
                  gtc !== 'AIR' &&
                  !gasTypeCodes.some(cd => requiredCodes.includes(cd))
                ) {
                  errorCodes.push({ code: 'PGVP-13-D' });
                }
              }
            }
          });
        }
      }
    }

    const distintErrorCodes = [
      ...new Map(errorCodes.map(item => [item['code'], item])).values(),
    ];

    distintErrorCodes.forEach(dec => {
      errorList.push(this.getMessage(dec.code, dec.options));
    });

    return errorList;
  }

  getMessage(messageKey: string, messageArgs?: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

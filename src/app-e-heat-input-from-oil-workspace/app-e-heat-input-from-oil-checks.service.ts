import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { AppECorrelationTestRunWorkspaceRepository } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.repository';
import {
  AppEHeatInputFromOilBaseDTO,
  AppEHeatInputFromOilImportDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppECorrelationTestRun } from '../entities/workspace/app-e-correlation-test-run.entity';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

@Injectable()
export class AppEHeatInputFromOilChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly appETestRunRepo: AppECorrelationTestRunWorkspaceRepository,
    private readonly repo: AppEHeatInputFromOilWorkspaceRepository,
    private readonly monitorSystemRepository: MonitorSystemRepository,
  ) { }

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
    dto: AppEHeatInputFromOilBaseDTO | AppEHeatInputFromOilImportDTO,
    appEHeatInputFromOilId: string,
    appETestRunId: string,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    this.logger.log('Running Appendix E Heat Input From Oil Checks');

    const appETestRun = await this.appETestRunRepo.findOneWithAncestors(
      appETestRunId,
    );

    error = await this.appE50Check(appEHeatInputFromOilId, dto, appETestRun);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
    this.logger.log('Completed Appendix E Heat Input From Oil Checks');
    return errorList;
  }

  async runImportChecks(
    importDTOs: AppEHeatInputFromOilImportDTO[] = [],
    locationId: string,
    testTypeCode: string,
    testNumber: string
  ): Promise<string[]> {
    let errors: string[] = [];
    let monSysIDs = [];

    for (let dto of importDTOs) {
      const { monitoringSystemId } = dto;

      if (monSysIDs.includes(monitoringSystemId)) {
        errors.push(this.getMessage('APPE-50-A', {
          recordtype: 'Appendix E Heat Input from Oil',
          fieldnames: 'MonitoringSystemID',
        }))
      } else monSysIDs.push(monitoringSystemId);
      if (testTypeCode === 'APPE') {
        const systemError = await this.validateSystemType(locationId, monitoringSystemId, testNumber);
        if (systemError) {
          errors.push(systemError);
        }
      }
    }

    return errors;
  }

  private async validateSystemType(locationId: string, monitoringSystemId: string, testNumber: string): Promise<string | null> {
    const system = await this.monitorSystemRepository.findOne({
      where: { locationId, monitoringSystemID: monitoringSystemId },
    })

    if (system && system.systemTypeCode !== 'GAS') {
      return CheckCatalogService.formatResultMessage('IMPORT-35-A', {
        locationId,
        testTypeCode: 'APPE',
        testNumber
      });
    }

    return null;
  }

  async appE50Check(
    aehiOilId: string,
    dto: AppEHeatInputFromOilBaseDTO,
    appETestRun: AppECorrelationTestRun,
  ) {
    let error: string = null;
    let appETestSummary = appETestRun.appECorrelationTestSummary;

    if (
      dto.monitoringSystemId &&
      appETestRun.runNumber != null &&
      appETestSummary.operatingLevelForRun != null
    ) {
      const duplicate = await this.repo.findDuplicate(
        aehiOilId,
        appETestSummary.id,
        appETestSummary.operatingLevelForRun,
        appETestRun.runNumber,
        dto.monitoringSystemId,
      );

      if (duplicate)
        error = this.getMessage('APPE-50-A', {
          recordtype: 'Appendix E Heat Input From Oil',
          fieldnames: 'OperatingLevelForRun, RunNumber, MonitoringSystemID',
        });
    }

    return error;
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

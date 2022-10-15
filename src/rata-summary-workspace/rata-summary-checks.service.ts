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
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

const KEY = 'RATA Summary';

@Injectable()
export class RataSummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(RataSummaryWorkspaceRepository)
    private readonly repository: RataSummaryWorkspaceRepository,
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

  async runChecks(
    locationId: string,
    rataSummary: RataSummaryBaseDTO | RataSummaryImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
    rataId?: string,
    testSumId?: string,
    rataSummaries?: RataSummaryImportDTO[],
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;
    this.logger.info('Running Rata Summary Checks');

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOne({
        monitoringSystemID: testSummary.monitoringSystemID,
        locationId: locationId,
      });

      // IMPORT-30 Extraneous RATA Summary Data Check
      error = await this.import30Check(rataSummary, testSumRecord);
      if (error) {
        errorList.push(error);
      }
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      // RATA-17 Mean CEM Value Valid
      error = this.rata17Check(testSumRecord, rataSummary.meanCEMValue);
      if (error) {
        errorList.push(error);
      }

      if (!isUpdate) {
        // RATA-107 Duplicate RATA Summary
        error = await this.rata107Check(
          rataSummary,
          isImport,
          rataId,
          rataSummaries,
        );
        if (error) {
          errorList.push(error);
        }
      }
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed RATA Summary Checks');
    return errorList;
  }

  private rata17Check(
    testSumRecord: TestSummary,
    meanCEMValue: number,
  ): string {
    let error: string = null;

    if (testSumRecord.system?.systemTypeCode === 'HG' && meanCEMValue === 0) {
      error = CheckCatalogService.formatResultMessage('RATA-17-C', {
        key: KEY,
        fieldname: 'meanCEMValue',
      });
    }

    if (meanCEMValue < 0) {
      error = CheckCatalogService.formatResultMessage('RATA-17-B', {
        key: KEY,
        fieldname: 'meanCEMValue',
      });
    }

    return error;
  }

  private async rata107Check(
    rataSummary: RataSummaryBaseDTO | RataSummaryImportDTO,
    isImport: boolean,
    rataId: string,
    rataSummaries: RataSummaryImportDTO[],
  ): Promise<string> {
    let error: string = null;
    let duplicates: RataSummary[] | RataSummaryBaseDTO[];

    if (rataId && !isImport) {
      duplicates = await this.repository.find({
        rataId: rataId,
        operatingLevelCode: rataSummary.operatingLevelCode,
      });
      if (duplicates.length > 0) {
        error = CheckCatalogService.formatResultMessage('RATA-107-A', {
          recordtype: KEY,
          fieldnames: 'operatingLevelCode',
        });
      }
    }

    if (rataSummaries?.length > 1 && isImport) {
      duplicates = rataSummaries.filter(
        rs => rs.operatingLevelCode === rataSummary.operatingLevelCode,
      );

      if (duplicates.length > 1) {
        error = CheckCatalogService.formatResultMessage('RATA-107-A', {
          recordtype: KEY,
          fieldnames: 'operatingLevelCode',
        });
      }
    }
    return error;
  }

  private async import30Check(
    rataSummary: RataSummaryBaseDTO | RataSummaryImportDTO,
    testSummary: any,
  ): Promise<string> {
    let error: string = null;
    const extraneousRataSummaryFields: string[] = [];

    if (
      rataSummary.co2OrO2ReferenceMethodCode !== null ||
      rataSummary.stackDiameter !== null ||
      rataSummary.stackArea !== null ||
      rataSummary.numberOfTraversePoints !== null ||
      rataSummary.calculatedWAF !== null ||
      rataSummary.defaultWAF !== null
    ) {
      if (testSummary.system?.systemTypeCode !== 'FLOW') {
        if (rataSummary.co2OrO2ReferenceMethodCode !== null) {
          extraneousRataSummaryFields.push('CO2 or O2 Reference Method Code');
        }

        if (rataSummary.stackDiameter !== null) {
          extraneousRataSummaryFields.push('Stack Diameter');
        }

        if (rataSummary.stackArea !== null) {
          extraneousRataSummaryFields.push('Stack Area');
        }

        if (rataSummary.numberOfTraversePoints !== null) {
          extraneousRataSummaryFields.push('Number Of Traverse Points');
        }

        if (rataSummary.calculatedWAF !== null) {
          extraneousRataSummaryFields.push('Calculated WAF');
        }

        if (rataSummary.defaultWAF !== null) {
          extraneousRataSummaryFields.push('Default WAF');
        }
      }

      if (extraneousRataSummaryFields?.length > 0) {
        error = this.getMessage('IMPORT-30-A', {
          fieldname: extraneousRataSummaryFields,
          locationID: testSummary.unitId
            ? testSummary.unitId
            : testSummary.stackPipeId,
          testTypeCode: testSummary.testTypeCode,
          testNumber: testSummary.testNumber,
        });
      }
    }
    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

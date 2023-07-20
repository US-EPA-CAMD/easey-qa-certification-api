import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingImportDTO,
} from '../dto/air-emission-test.dto';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

const KEY = 'Air Emission Testing';

@Injectable()
export class AirEmissionTestingChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
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
    aetb: AirEmissionTestingBaseDTO | AirEmissionTestingImportDTO,
    testSumId: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.log('Running Air Emission Testing Checks');

    if (isImport) {
      testSumRecord = testSummary;
    }

    if (isUpdate) {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    // AETB-9-B
    error = this.aetb9Check(testSumRecord, aetb.examDate);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);

    this.logger.log('Completed Air Emission Testing Checks');

    return errorList;
  }

  // AETB-9 Exam Date Valid
  private aetb9Check(testSumRecord: TestSummary, examDate: Date): string {
    if (examDate > testSumRecord.beginDate) {
      let error: string = null;

      error = CheckCatalogService.formatResultMessage('AETB-9-B', {
        key: KEY,
        fieldname: 'examDate',
      });

      return error;
    }
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}

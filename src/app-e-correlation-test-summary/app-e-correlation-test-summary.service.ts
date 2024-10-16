import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { AppECorrelationTestRunService } from '../app-e-correlation-test-run/app-e-correlation-test-run.service';
import {
  AppECorrelationTestSummaryDTO,
  AppECorrelationTestSummaryRecordDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { AppendixETestSummaryRepository } from './app-e-correlation-test-summary.repository';

@Injectable()
export class AppECorrelationTestSummaryService {
  constructor(
    private readonly map: AppECorrelationTestSummaryMap,
    private readonly repository: AppendixETestSummaryRepository,
    @Inject(forwardRef(() => AppECorrelationTestRunService))
    private readonly appECorrelationTestRunService: AppECorrelationTestRunService,
  ) {}

  async getAppECorrelations(
    testSumId: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getAppECorrelation(
    id: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Appendix E Correlation Test Summary record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getAppECorrelationsByTestSumIds(
    testSumIds: string[],
  ): Promise<AppECorrelationTestSummaryDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<AppECorrelationTestSummaryDTO[]> {
    const appECorrelationTests = await this.getAppECorrelationsByTestSumIds(
      testSumIds,
    );

    const testRuns = await this.appECorrelationTestRunService.export(
      appECorrelationTests.map(i => i.id),
    );

    appECorrelationTests.forEach(s => {
      s.appendixECorrelationTestRunData = testRuns.filter(
        i => i.appECorrTestSumId === s.id,
      );
    });
    return appECorrelationTests;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryRepository } from './test-summary.repository';
import { LinearitySummaryService } from '../linearity-summary/linearity-summary.service';

@Injectable()
export class TestSummaryService {

  constructor(
    private readonly logger: Logger,
    private readonly map: TestSummaryMap,
    private readonly linearityService: LinearitySummaryService,
    @InjectRepository(TestSummaryRepository)
    private readonly repository: TestSummaryRepository,
  ) {}

  async getTestSummaryById(
    testSumId: string,
  ): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(
      testSumId,
    );
    return this.map.one(result);
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode: string,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      testTypeCode,
    );

    return this.map.many(results);
  }

  async getTestSummaries(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testTypeCode?: string,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
      testTypeCode,
    )

    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
  ): Promise<TestSummaryDTO[]> {
    const promises = [];

    const summaries = await this.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
    );

    promises.push(
      new Promise(async (resolve, _reject) => {
        let linearities = null;
        const testSumIds = summaries
          .filter(i => i.testTypeCode === 'LINE')
          .map(i => i.id );

        if (testSumIds) {
          linearities = await this.linearityService.export(testSumIds);
          summaries.forEach(s => {
            s.linearitySummaryData = linearities.filter(i => i.testSumId === s.id)
          });
        }

        resolve(linearities);
      }),
    );

    await Promise.all(promises);
    return summaries;
  }
}

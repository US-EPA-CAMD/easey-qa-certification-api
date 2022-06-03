import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryParamsDTO } from '../dto/test-summary-params.dto';
import { TestSummaryRepository } from './test-summary.repository';

@Injectable()
export class TestSummaryService {

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly map: TestSummaryMap,
    @InjectRepository(TestSummaryRepository)
    private readonly repository: TestSummaryRepository,
  ) {}

  async getTestSummariesByLocationId(
    locationId: string,
    params: TestSummaryParamsDTO,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      params.testTypeCode
    );

    return this.map.many(results);
  }

  async getTestSummaryById(
    _locationId: string,
    testSumId: string,
  ): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(testSumId);
    return this.map.one(result);
  }
}

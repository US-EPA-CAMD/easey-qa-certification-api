import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { TestSummary } from '../entities/test-summary.entity';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestSummaryParamsDTO } from '../dto/test-summary-params.dto';
import { TestSummaryRepository } from './test-summary.repository';

@Injectable()
export class TestSummaryService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    @InjectRepository(TestSummaryRepository)
    private readonly repository: TestSummaryRepository,
  ) {}

  async getTestSummaries(
    params: TestSummaryParamsDTO,
  ): Promise<TestSummary[]> {
    // TODO: Currently returning entity bu need to map to DTO
    return this.repository.getTestSummaries(
      params.facilityId,
      params.unitId,
      params.stackPipeId,
      params.testTypeCode
    );
  }

  async getTestSummary(
    testSumId: string,
  ): Promise<TestSummary> {
    // TODO: Currently returning entity bu need to map to DTO
    return this.repository.findOne(testSumId);
  }
}

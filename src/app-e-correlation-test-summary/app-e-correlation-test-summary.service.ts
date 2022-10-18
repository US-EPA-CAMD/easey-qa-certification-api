import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppendixETestSummaryRepository } from './app-e-correlation-test-summary.repository';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import {
  AppECorrelationTestSummaryDTO,
  AppECorrelationTestSummaryRecordDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

@Injectable()
export class AppECorrelationTestSummaryService {
  constructor(
    private readonly map: AppECorrelationTestSummaryMap,
    @InjectRepository(AppendixETestSummaryRepository)
    private readonly repository: AppendixETestSummaryRepository,
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
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Correlation Test Summary record not found with Record Id [${id}].`,
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
    return this.getAppECorrelationsByTestSumIds(testSumIds);
  }
}

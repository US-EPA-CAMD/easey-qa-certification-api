import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { AppECorrelationTestSummaryRecordDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AeCorrelationSummaryMap } from '../maps/app-e-correlation-summary.map';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { AppendixETestSummaryRepository } from './app-e-correlation-test-summary.repository';

@Injectable()
export class AppECorrelationTestSummaryService {
  constructor(
    private readonly map: AeCorrelationSummaryMap,
    @Inject(forwardRef(() => TestSummaryService))
    private readonly testSummaryService: TestSummaryService,
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
}

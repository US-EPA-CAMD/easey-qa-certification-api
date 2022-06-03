import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';

import { TestSummaryMap} from '../maps/test-summary.map';
import { TestSummaryRepository } from '../test-summary/test-summary.repository';
import { LinearitySummaryRepository } from '../linearity-summary/linearity-summary.repository';
import { LinearityInjectionRepository } from '../linearity-injection/linearity-injection.repository';

@Injectable()
export class QACertificationService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly testSummaryMap: TestSummaryMap,
    @InjectRepository(TestSummaryRepository)
    private readonly testSummaryRepository: TestSummaryRepository,
    @InjectRepository(LinearitySummaryRepository)
    private readonly linearitySummaryRepository: LinearitySummaryRepository,
    @InjectRepository(LinearityInjectionRepository)
    private readonly linearityInjectionRepository: LinearityInjectionRepository,
  ) {}

  async export(
    params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    const promises = [];

    const testSummaries = await this.testSummaryRepository.getTestSummaries(
      params.facilityId, params.unitId, params.stackPipeId,
    )

    const LINEARITY_SUMMARIES = 0;
    promises.push(
      new Promise(async (resolve, _reject) => {
        const testSumIds = testSummaries
          .filter(i => i.testTypeCode === 'LINE')
          .map(i => i.id );

        const linearitySummaries = await this.linearitySummaryRepository.find({
          where: { testSumId: In(testSumIds) },
        });

        const linearitySummaryIds = linearitySummaries.map(i => i.id);

        const injections = await this.linearityInjectionRepository.find({
          where: { linSumId: In(linearitySummaryIds) },
        });

        linearitySummaries.forEach(ls => {
          ls.injections = injections.filter(
            i => i.linSumId == ls.id,
          );
        });

        resolve(linearitySummaries);
      }),
    );

    const results = await Promise.all(promises);

    testSummaries.forEach(ts => {
      ts.linearitySummaries = results[LINEARITY_SUMMARIES].filter(
        i => i.testSumId == ts.id
      );
    });

    return {
      orisCode: params.facilityId,
      testSummaryData: await this.testSummaryMap.many(testSummaries),
    };
  }
}

import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  QACertificationImportDTO,
  QACertificationDTO
} from '../dto/qa-certification.dto';

import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryMap} from '../maps/test-summary.map';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import { LinearityInjectionWorkspaceRepository } from '../linearity-injection-workspace/linearity-injection.repository';

@Injectable()
export class QACertificationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly testSummaryMap: TestSummaryMap,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(LinearitySummaryWorkspaceRepository)
    private readonly linearitySummaryRepository: LinearitySummaryWorkspaceRepository,
    @InjectRepository(LinearityInjectionWorkspaceRepository)
    private readonly linearityInjectionRepository: LinearityInjectionWorkspaceRepository,
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

import { Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryService } from '../test-summary/test-summary.service';

@Injectable()
export class QACertificationService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryService,
  ) {}

  async export(
    params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    const promises = [];

    const SUMMARIES = 0;
    promises.push(
      this.testSummaryService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
      )
    );

    const EVENTS = SUMMARIES + 1;
    const EXT_EXEMPTIONS = EVENTS + 1;

    const results = await Promise.all(promises);

    return {
      orisCode: params.facilityId,
      testSummaryData: results[SUMMARIES],
      certificationEventData: results[EVENTS],
      testExtensionExemptionData: results[EXT_EXEMPTIONS],
    };
  }
}

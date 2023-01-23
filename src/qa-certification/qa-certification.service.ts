import { Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { TestExtensionExemptionsService } from '../test-extension-exemptions/test-extension-exemptions.service';

@Injectable()
export class QACertificationService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryService,
    private readonly testExtensionExemptionService: TestExtensionExemptionsService,
  ) {}

  async export(params: QACertificationParamsDTO): Promise<QACertificationDTO> {
    const promises = [];

    const SUMMARIES = 0;
    promises.push(
      this.testSummaryService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
        params.testSummaryIds,
        params.testTypeCodes,
        params.beginDate,
        params.endDate,
      ),
    );

    const EVENTS = SUMMARIES + 1;
    const EXT_EXEMPTIONS = EVENTS + 1;
    promises.push(
      this.testExtensionExemptionService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
        params.qaTestExtensionExemptiontIds,
      ),
    );

    const results = await Promise.all(promises);

    return {
      orisCode: Number(params.facilityId),
      testSummaryData: results[SUMMARIES],
      certificationEventData: results[EVENTS],
      testExtensionExemptionData: results[EXT_EXEMPTIONS],
    };
  }
}

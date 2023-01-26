import { Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { TestExtensionExemptionsService } from '../test-extension-exemptions/test-extension-exemptions.service';
import { QaCertificationEventService } from '../qa-certification-event/qa-certification-event.service';

@Injectable()
export class QACertificationService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryService,
    private readonly testExtensionExemptionService: TestExtensionExemptionsService,
    private readonly qaCertEventService: QaCertificationEventService,
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
    promises.push(
      this.qaCertEventService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
        params.qaCertificationEventIds,
      ),
    );

    const EXT_EXEMPTIONS = EVENTS + 1;
    promises.push(
      this.testExtensionExemptionService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
        params.qaTestExtensionExemptionIds,
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

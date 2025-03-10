import { Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { TestExtensionExemptionsService } from '../test-extension-exemptions/test-extension-exemptions.service';
import { QaCertificationEventService } from '../qa-certification-event/qa-certification-event.service';
import { EaseyContentService } from '../qa-certification-easey-content/easey-content.service';
import { buildQACertificationExport } from '../utilities/remove-non-reported-values';

@Injectable()
export class QACertificationService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryService,
    private readonly testExtensionExemptionService: TestExtensionExemptionsService,
    private readonly qaCertEventService: QaCertificationEventService,
    private readonly easeyContentService: EaseyContentService,
  ) {}

  /**
   * Export QA certification data
   * @param params Export parameters
   * @param rptValuesOnly Whether to include only reported values
   * @returns QA certification data
   */
  async export(
    params: QACertificationParamsDTO,
    rptValuesOnly: boolean = false,
  ): Promise<QACertificationDTO> {
    // Use the shared utility function to build the export data
    return buildQACertificationExport(
      params,
      {
        testSummaryService: this.testSummaryService,
        qaCertEventService: this.qaCertEventService,
        testExtensionExemptionService: this.testExtensionExemptionService,
      },
      this.easeyContentService.QaCertificationSchema?.version,
      rptValuesOnly,
    );
  }
}
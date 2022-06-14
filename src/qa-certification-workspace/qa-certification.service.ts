import { Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';

import { ImportChecksService } from '../import-checks/import-checks.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class QACertificationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly importChecksService: ImportChecksService,
    private readonly testSummaryService: TestSummaryWorkspaceService,
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

  async import(payload: QACertificationImportDTO) {
    this.logger.info(`Importing QA Certification data for Facility Id (Oris Code) ${payload.orisCode}`);
    await this.importChecksService.importChecks(payload);
  }
}

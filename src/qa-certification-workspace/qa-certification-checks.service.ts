import { BadRequestException, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { LocationChecksService } from '../location-workspace/location-checks.service';
import { TestSummaryChecksService } from '../test-summary-workspace/test-summary-checks.service';

@Injectable()
export class QACertificationChecksService {

  constructor(
    private readonly logger: Logger,
    private readonly locationChecksService: LocationChecksService,
    private readonly testSummaryChecksService: TestSummaryChecksService,
  ) {}

  private async extractErrors(
    promises: Promise<string[]>[]
  ): Promise<string[]> {
    const errorList: string[] = [];
    const errors = await Promise.all(promises);
    errors.forEach(p => {
      errorList.push(...p);
    });
    return errorList;
  }

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }
  }

  async runChecks(
    payload: QACertificationImportDTO
  ): Promise<string[]> {
    this.logger.info('Running QA Certification Checks');

    const errorList: string[] = [];
    const promises: Promise<string[]>[] = [];    
    const locations: LocationIdentifiers[] = [];

    const addLocation = (i: any) => {
      const systemIds = [];
      const componentIds = [];

      const location = locations.find(l => {
        if ((l.unitId && l.unitId === i.unitId) ||
            (l.stackPipeId && l.stackPipeId === i.stackPipeId))
          return l;
      });

      if (location) {
        if (i.monitoringSystemId && !location.systemIds.includes(i.monitoringSystemId)) {
          location.systemIds.push(i.monitoringSystemId);
        }
        if (i.componentId && !location.componentIds.includes(i.componentId)) {
          location.componentIds.push(i.componentId);
        }
      }
      else {
        if (i.monitoringSystemId) systemIds.push(i.monitoringSystemId);
        if (i.componentId) componentIds.push(i.componentId);

        locations.push({
          unitId: i.unitId,
          stackPipeId: i.stackPipeId,
          systemIds,
          componentIds,
        });
      }
    };

    if (payload.testSummaryData) {
      payload.testSummaryData.forEach(i => addLocation(i));
    }

    if (payload.certificationEventData) {
      payload.certificationEventData.forEach(i => addLocation(i));
    }
    
    if (payload.testExtensionExemptionData) {
      payload.testExtensionExemptionData.forEach(i => addLocation(i));
    }

    if (locations.length === 0) {
      errorList.push(
        'There are no test summary, certifications events, or extension/exmeption records present in the file to be imported'
      );
    }
    this.throwIfErrors(errorList);

    errorList.push(...(
      await this.locationChecksService.runChecks(
        payload.orisCode,
        locations,
      )
    ));
    this.throwIfErrors(errorList);

    payload.testSummaryData.forEach(async (summary) => {
      promises.push(
        this.testSummaryChecksService.runChecks(
          summary,
          true,
        )
      );
    })
    this.throwIfErrors(
      await this.extractErrors(promises)
    );

    return errorList;
  }
}

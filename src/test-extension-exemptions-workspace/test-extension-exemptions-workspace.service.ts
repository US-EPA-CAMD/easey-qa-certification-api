import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionDTO,
  TestExtensionExemptionImportDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionsRepository } from '../test-extension-exemptions/test-extension-exemptions.repository';

@Injectable()
export class TestExtensionExemptionsWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: TestExtensionExemptionMap,
    private readonly repository: TestExtensionExemptionsWorkspaceRepository,
    private readonly testExtensionExemptionsRepository: TestExtensionExemptionsRepository,
    private readonly monitorLocationRepository: MonitorLocationRepository,
    private readonly componentRepository: ComponentWorkspaceRepository,
    private readonly monSysRepository: MonitorSystemWorkspaceRepository,
    private readonly reportingPeriodRepository: ReportingPeriodRepository,
  ) {}

  async getTestExtensionExemptionById(
    id: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    const result = await this.repository.getTestExtensionExemptionById(id);

    if (!result) {
      throw new EaseyException(
        new Error(
          `A QA Test Extension Exemtion record not found with Record Id [${id}]`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getTestExtensionExemptionsByLocationId(
    locationId: string,
  ): Promise<TestExtensionExemptionRecordDTO[]> {
    const results = await this.repository.getTestExtensionExemptionsByLocationId(
      locationId,
    );

    // Extract event IDs
    const extExemptionIds = results.map(event => event.id);

    let submittedExtExemptionIds: string[] = [];
    if (extExemptionIds.length > 0) {
      // Step 2: Retrieve corresponding data from camdecmps.test_extension_exemption
      const submittedExtExemptions = await this.testExtensionExemptionsRepository.getTestExtensionExemptionsByLocationId(locationId);
      submittedExtExemptionIds = submittedExtExemptions.map(event => event.id);
    }

    // Step 3: Map the results to DTOs and include isSubmitted and isSavedNotSubmitted values
    const dtoPromises = results.map(async event => {
      const dto = await this.map.one(event);
      dto.isSubmitted = submittedExtExemptionIds.includes(event.id);
      dto.isSavedNotSubmitted = !dto.isSubmitted;
      return dto;
    });

    return Promise.all(dtoPromises);
  }

  async getTestExtensions(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaTestExtensionExemptionIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestExtensionExemptionDTO[]> {
    const results = await this.repository.getTestExtensionsByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      qaTestExtensionExemptionIds,
      beginDate,
      endDate,
    );
    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaTestExtensionExemptionIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestExtensionExemptionDTO[]> {
    const results = await this.getTestExtensions(
      facilityId,
      unitIds,
      stackPipeIds,
      qaTestExtensionExemptionIds,
      beginDate,
      endDate,
    );
    return results;
  }

  async import(
    locationId: string,
    payload: TestExtensionExemptionImportDTO,
    userId: string,
  ) {
    const {
      reportPeriodId,
      monitoringSystemRecordId,
      componentRecordId,
    } = await this.lookupValues(locationId, payload);

    const record = await this.repository.findOneBy({
      locationId,
      fuelCode: payload.fuelCode ?? IsNull(),
      extensionOrExemptionCode: payload.extensionOrExemptionCode,
      reportPeriodId: reportPeriodId ?? IsNull(),
      monitoringSystemRecordId: monitoringSystemRecordId ?? IsNull(),
      componentRecordId: componentRecordId ?? IsNull(),
    });

    let importedTestExtensionExemption;
    if (record) {
      importedTestExtensionExemption = await this.updateTestExtensionExemption(
        locationId,
        record.id,
        payload,
        userId,
      );
    } else {
      importedTestExtensionExemption = await this.createTestExtensionExemption(
        locationId,
        payload,
        userId,
      );
    }

    this.logger.log(
      `QA Test Extension Exemption Record Successfully Imported. Record Id: ${importedTestExtensionExemption.id}`,
    );

    return null;
  }

  async createTestExtensionExemption(
    locationId: string,
    payload: TestExtensionExemptionBaseDTO,
    userId: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    const timestamp = currentDateTime();
    const {
      reportPeriodId,
      componentRecordId,
      monitoringSystemRecordId,
    } = await this.lookupValues(locationId, payload);

    const location = await this.monitorLocationRepository.getLocationByIdUnitIdStackPipeId(
      locationId,
      payload.unitId,
      payload.stackPipeId,
    );

    if (!location) {
      throw new EaseyException(
        new Error(
          `The provided Location Id [${locationId}] does not match the provided Unit/Stack [${
            payload.unitId ? payload.unitId : payload.stackPipeId
          }]`,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const entity = this.repository.create({
      ...payload,
      id: uuid(),
      locationId,
      monitoringSystemRecordId,
      componentRecordId,
      reportPeriodId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
      lastUpdated: timestamp,
      needsEvalFlag: 'Y',
      updatedStatusFlag: 'Y',
      evalStatusCode: 'EVAL',
      pendingStatusCode: 'PENDING',
      submissionAvailabilityCode: 'REQUIRE',
    });

    await this.repository.save(entity);

    const result = await this.repository.getTestExtensionExemptionById(
      entity.id,
    );

    return this.map.one(result);
  }

  async updateTestExtensionExemption(
    locationId: string,
    id: string,
    payload: TestExtensionExemptionBaseDTO,
    userId: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOneBy({ id });

    if (!record) {
      throw new EaseyException(
        new Error(
          `A test extension exemption record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    const {
      reportPeriodId,
      componentRecordId,
      monitoringSystemRecordId,
    } = await this.lookupValues(locationId, payload);

    record.userId = userId;
    record.lastUpdated = timestamp;
    record.updateDate = timestamp;
    record.reportPeriodId = reportPeriodId;
    record.monitoringSystemRecordId = monitoringSystemRecordId;
    record.componentRecordId = componentRecordId;
    record.hoursUsed = payload.hoursUsed;
    record.spanScaleCode = payload.spanScaleCode;
    record.fuelCode = payload.fuelCode;
    record.extensionOrExemptionCode = payload.extensionOrExemptionCode;
    record.needsEvalFlag = 'Y';
    record.updatedStatusFlag = 'Y';
    record.evalStatusCode = 'EVAL';
    record.pendingStatusCode = 'PENDING';
    record.submissionAvailabilityCode = 'REQUIRE';

    await this.repository.save(record);
    return this.getTestExtensionExemptionById(record.id);
  }

  async deleteTestExtensionExemption(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException(
        `Error deleting Test Extension Exemption record Id [${id}]`,
        e.message,
      );
    }
  }

  async lookupValues(
    locationId: string,
    payload: TestExtensionExemptionBaseDTO,
  ) {
    let reportPeriodId = null;
    let componentRecordId = null;
    let monitoringSystemRecordId = null;

    if (payload.year && payload.quarter) {
      const rptPeriod = await this.reportingPeriodRepository.findOneBy({
        year: payload.year,
        quarter: payload.quarter,
      });

      reportPeriodId = rptPeriod ? rptPeriod.id : null;
    }

    if (payload.componentId) {
      const component = await this.componentRepository.findOneBy({
        locationId: locationId,
        componentID: payload.componentId,
      });

      componentRecordId = component ? component.id : null;
    }

    if (payload.monitoringSystemId) {
      const monitorSystem = await this.monSysRepository.findOneBy({
        locationId: locationId,
        monitoringSystemID: payload.monitoringSystemId,
      });

      monitoringSystemRecordId = monitorSystem ? monitorSystem.id : null;
    }

    return { reportPeriodId, componentRecordId, monitoringSystemRecordId };
  }
}

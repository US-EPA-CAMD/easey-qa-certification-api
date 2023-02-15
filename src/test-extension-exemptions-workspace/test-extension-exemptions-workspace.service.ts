import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionDTO,
  TestExtensionExemptionImportDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { Unit } from './../entities/workspace/unit.entity';
import { StackPipe } from './../entities/workspace/stack-pipe.entity';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';

@Injectable()
export class TestExtensionExemptionsWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: TestExtensionExemptionMap,
    @InjectRepository(TestExtensionExemptionsWorkspaceRepository)
    private readonly repository: TestExtensionExemptionsWorkspaceRepository,
    @InjectRepository(UnitRepository)
    private readonly unitRepository: UnitRepository,
    @InjectRepository(StackPipeRepository)
    private readonly stackPipeRepository: StackPipeRepository,
    @InjectRepository(MonitorLocationRepository)
    private readonly monitorLocationRepository: MonitorLocationRepository,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentRepository: ComponentWorkspaceRepository,
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly monSysRepository: MonitorSystemWorkspaceRepository,
    @InjectRepository(ReportingPeriodRepository)
    private readonly reportingPeriodRepository: ReportingPeriodRepository,
  ) {}

  async getTestExtensionExemptionById(
    id: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    const result = await this.repository.getTestExtensionExemptionById(id);

    if (!result) {
      throw new LoggingException(
        `A QA Test Extension Exemtion record not found with Record Id [${id}]`,
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

    return this.map.many(results);
  }

  async getTestExtensions(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaTestExtensionExemptionIds?: string[],
  ): Promise<TestExtensionExemptionDTO[]> {
    const results = await this.repository.getTestExtensionsByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      qaTestExtensionExemptionIds,
    );
    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaTestExtensionExemptionIds?: string[],
  ): Promise<TestExtensionExemptionDTO[]> {
    const results = await this.getTestExtensions(
      facilityId,
      unitIds,
      stackPipeIds,
      qaTestExtensionExemptionIds,
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

    const record = await this.repository.findOne({
      where: {
        locationId,
        fuelCode: payload.fuelCode,
        extensionOrExemptionCode: payload.extensionOrExemptionCode,
        reportPeriodId,
        monitoringSystemRecordId,
        componentRecordId,
      },
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

    this.logger.info(
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

    const location = await this.monitorLocationRepository.findOne(locationId);

    let unit: Unit;
    let stackPipe: StackPipe;

    if (location.unitId) {
      unit = await this.unitRepository.findOne(location.unitId);
    } else {
      stackPipe = await this.stackPipeRepository.findOne(location.stackPipeId);
    }

    if (
      (unit && payload.unitId !== unit.name) ||
      (stackPipe && payload.stackPipeId !== stackPipe.name)
    ) {
      throw new LoggingException(
        `The provided Location Id [${locationId}] does not match the provided Unit/Stack [${
          payload.unitId ? payload.unitId : payload.stackPipeId
        }]`,
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
    const record = await this.repository.findOne(id);

    if (!record) {
      throw new LoggingException(
        `A test extension exemption record not found with Record Id [${id}].`,
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
      const rptPeriod = await this.reportingPeriodRepository.findOne({
        year: payload.year,
        quarter: payload.quarter,
      });

      reportPeriodId = rptPeriod ? rptPeriod.id : null;
    }

    if (payload.componentID) {
      const component = await this.componentRepository.findOne({
        locationId: locationId,
        componentID: payload.componentID,
      });

      componentRecordId = component ? component.id : null;
    }

    if (payload.monitoringSystemID) {
      const monitorSystem = await this.monSysRepository.findOne({
        locationId: locationId,
        monitoringSystemID: payload.monitoringSystemID,
      });

      monitoringSystemRecordId = monitorSystem ? monitorSystem.id : null;
    }

    return { reportPeriodId, componentRecordId, monitoringSystemRecordId };
  }
}

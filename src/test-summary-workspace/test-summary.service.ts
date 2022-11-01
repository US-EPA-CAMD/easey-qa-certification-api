import { v4 as uuid } from 'uuid';
import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import {
  TestSummaryDTO,
  TestSummaryBaseDTO,
  TestSummaryRecordDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';

import { currentDateTime } from '../utilities/functions';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { LinearitySummaryWorkspaceService } from '../linearity-summary-workspace/linearity-summary.service';

import { Unit } from './../entities/workspace/unit.entity';
import { StackPipe } from './../entities/workspace/stack-pipe.entity';
import { RataWorkspaceService } from '../rata-workspace/rata-workspace.service';

import { TestTypeCodes } from '../enums/test-type-code.enum';
import { ProtocolGasWorkspaceService } from '../protocol-gas-workspace/protocol-gas.service';
import { AppECorrelationTestSummaryWorkspaceService } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.service';
import { FuelFlowToLoadTestWorkspaceService } from '../fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.service';
import { CalibrationInjectionWorkspaceService } from '../calibration-injection-workspace/calibration-injection-workspace.service';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { FlowToLoadCheckWorkspaceService } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.service';
import { FuelFlowToLoadBaselineWorkspaceService } from '../fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.service';
import { FlowToLoadReferenceWorkspaceService } from '../flow-to-load-reference-workspace/flow-to-load-reference-workspace.service';
import { OnlineOfflineCalibrationWorkspaceService } from '../online-offline-calibration-workspace/online-offline-calibration.service';

@Injectable()
export class TestSummaryWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: TestSummaryMap,
    @Inject(forwardRef(() => LinearitySummaryWorkspaceService))
    private readonly linearityService: LinearitySummaryWorkspaceService,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly repository: TestSummaryWorkspaceRepository,
    @Inject(forwardRef(() => RataWorkspaceService))
    private readonly rataService: RataWorkspaceService,
    @Inject(forwardRef(() => ProtocolGasWorkspaceService))
    private readonly protocolGasService: ProtocolGasWorkspaceService,
    @Inject(forwardRef(() => FuelFlowToLoadTestWorkspaceService))
    private readonly fuelFlowToLoadTestWorkspaceService: FuelFlowToLoadTestWorkspaceService,
    @Inject(forwardRef(() => AppECorrelationTestSummaryWorkspaceService))
    private readonly appECorrelationTestSummaryWorkspaceService: AppECorrelationTestSummaryWorkspaceService,
    @Inject(forwardRef(() => CalibrationInjectionWorkspaceService))
    private readonly calInjWorkspaceService: CalibrationInjectionWorkspaceService,
    @InjectRepository(UnitRepository)
    private readonly unitRepository: UnitRepository,
    @InjectRepository(StackPipeRepository)
    private readonly stackPipeRepository: StackPipeRepository,
    @InjectRepository(MonitorLocationRepository)
    private readonly monitorLocationRepository: MonitorLocationRepository,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentRepository: ComponentWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monSysRepository: MonitorSystemRepository,
    @InjectRepository(ReportingPeriodRepository)
    private readonly reportingPeriodRepository: ReportingPeriodRepository,
    @Inject(forwardRef(() => FlowToLoadCheckWorkspaceService))
    private readonly flowToLoadCheckService: FlowToLoadCheckWorkspaceService,
    @Inject(forwardRef(() => FuelFlowToLoadBaselineWorkspaceService))
    private readonly fuelFlowToLoadBaselineService: FuelFlowToLoadBaselineWorkspaceService,
    private readonly flowToLoadCheckWorkspaceService: FlowToLoadCheckWorkspaceService,
    @Inject(forwardRef(() => FlowToLoadReferenceWorkspaceService))
    private readonly flowToLoadReferenceWorkspaceService: FlowToLoadReferenceWorkspaceService,
    @Inject(forwardRef(() => OnlineOfflineCalibrationWorkspaceService))
    private readonly onlineOfflineCalibrationWorkspaceService: OnlineOfflineCalibrationWorkspaceService,
  ) {}

  async getTestSummaryById(testSumId: string): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(testSumId);

    if (!result) {
      throw new LoggingException(
        `A test summary record not found with Record Id [${testSumId}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    const dto = await this.map.one(result);

    delete dto.calibrationInjectionData;
    delete dto.linearitySummaryData;
    delete dto.rataData;
    delete dto.flowToLoadReferenceData;
    delete dto.flowToLoadCheckData;
    delete dto.cycleTimeSummaryData;
    delete dto.onlineOfflineCalibrationData;
    delete dto.fuelFlowmeterAccuracyData;
    delete dto.transmitterTransducerData;
    delete dto.fuelFlowToLoadBaselineData;
    delete dto.fuelFlowToLoadTestData;
    delete dto.unitDefaultTestData;
    delete dto.hgSummaryData;
    delete dto.testQualificationData;
    delete dto.protocolGasData;
    delete dto.airEmissionTestingData;
    delete dto.appECorrelationTestSummaryData;

    return dto;
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      testTypeCode,
      beginDate,
      endDate,
    );

    return this.map.many(results);
  }

  async getTestSummaries(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testSummaryIds?: string[],
    testTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testSummaryIds?: string[],
    testTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const promises = [];

    const testSummaries = await this.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    promises.push(
      new Promise(async (resolve, _reject) => {
        let linearitySummaryData,
          rataData,
          protocolGasData,
          fuelFlowToLoadTestData,
          calibrationInjectionData,
          flowToLoadCheckData,
          flowToLoadReferenceData,
          appECorrelationTestSummaryData,
          onlineOfflineCalibrationData;

        let testSumIds;
        if (testTypeCodes?.length > 0) {
          testSumIds = testSummaries.filter(i =>
            testTypeCodes.includes(i.testTypeCode),
          );
        }
        testSumIds = testSummaries.map(i => i.id);

        if (testSumIds) {
          linearitySummaryData = await this.linearityService.export(testSumIds);

          rataData = await this.rataService.export(testSumIds);

          protocolGasData = await this.protocolGasService.export(testSumIds);

          appECorrelationTestSummaryData = await this.appECorrelationTestSummaryWorkspaceService.export(
            testSumIds,
          );

          fuelFlowToLoadTestData = await this.fuelFlowToLoadTestWorkspaceService.export(
            testSumIds,
          );

          calibrationInjectionData = await this.calInjWorkspaceService.export(
            testSumIds,
          );

          flowToLoadCheckData = await this.flowToLoadCheckWorkspaceService.export(
            testSumIds,
          );

          flowToLoadReferenceData = await this.flowToLoadReferenceWorkspaceService.export(
            testSumIds,
          );

          onlineOfflineCalibrationData = await this.onlineOfflineCalibrationWorkspaceService.export(
            testSumIds,
          );

          testSummaries.forEach(s => {
            s.linearitySummaryData = linearitySummaryData.filter(
              i => i.testSumId === s.id,
            );
            s.rataData = rataData.filter(i => i.testSumId === s.id);
            s.protocolGasData = protocolGasData.filter(
              i => i.testSumId === s.id,
            );
            s.appECorrelationTestSummaryData = appECorrelationTestSummaryData.filter(
              i => i.testSumId === s.id,
            );
            s.fuelFlowToLoadTestData = fuelFlowToLoadTestData.filter(
              i => i.testSumId === s.id,
            );
            s.calibrationInjectionData = calibrationInjectionData.filter(
              i => i.testSumId === s.id,
            );
            s.flowToLoadCheckData = flowToLoadCheckData.filter(
              i => i.testSumId === s.id,
            );
            s.flowToLoadReferenceData = flowToLoadReferenceData.filter(
              i => i.testSumId === s.id,
            );
            s.onlineOfflineCalibrationData = onlineOfflineCalibrationData.filter(
              i => i.testSumId === s.id,
            );
          });
        }

        resolve(testSummaries);
      }),
    );

    await Promise.all(promises);
    return testSummaries;
  }

  async import(
    locationId: string,
    payload: TestSummaryImportDTO,
    userId: string,
    historicalrecordId?: string,
  ) {
    const promises = [];

    const summary = await this.repository.getTestSummaryByLocationId(
      locationId,
      payload.testTypeCode,
      payload.testNumber,
    );

    if (summary) {
      await this.deleteTestSummary(summary.id);
    }

    const createdTestSummary = await this.createTestSummary(
      locationId,
      payload,
      userId,
      historicalrecordId,
    );

    this.logger.info(
      `Test Summary Successfully Imported. Record Id: ${createdTestSummary.id}`,
    );

    if (
      payload.linearitySummaryData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.LINE
    ) {
      for (const linearitySummary of payload.linearitySummaryData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.linearityService.import(
                createdTestSummary.id,
                linearitySummary,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.rataData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.RATA
    ) {
      for (const rata of payload.rataData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.rataService.import(
                createdTestSummary.id,
                rata,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.protocolGasData?.length > 0 &&
      [
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.UNITDEF.toString(),
      ].includes(payload.testTypeCode)
    ) {
      for (const protocolGas of payload.protocolGasData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.protocolGasService.import(
                createdTestSummary.id,
                protocolGas,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.fuelFlowToLoadTestData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.FF2LTST
    ) {
      for (const fuelFlowToLoadTest of payload.fuelFlowToLoadTestData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.fuelFlowToLoadTestWorkspaceService.import(
                createdTestSummary.id,
                fuelFlowToLoadTest,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.flowToLoadCheckData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.F2LCHK
    ) {
      for (const flowToLoadCheck of payload.flowToLoadCheckData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.flowToLoadCheckWorkspaceService.import(
                createdTestSummary.id,
                flowToLoadCheck,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.fuelFlowToLoadBaselineData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.FF2LBAS
    ) {
      for (const fuelFlowToLoadBaseline of payload.fuelFlowToLoadBaselineData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.fuelFlowToLoadBaselineService.import(
                createdTestSummary.id,
                fuelFlowToLoadBaseline,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.flowToLoadReferenceData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.F2LREF
    ) {
      for (const flowToLoadReference of payload.flowToLoadReferenceData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.flowToLoadReferenceWorkspaceService.import(
                createdTestSummary.id,
                flowToLoadReference,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.appECorrelationTestSummaryData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.APPE
    ) {
      for (const appECorrelationTestSummary of payload.appECorrelationTestSummaryData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.appECorrelationTestSummaryWorkspaceService.import(
                locationId,
                createdTestSummary.id,
                appECorrelationTestSummary,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.calibrationInjectionData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.SEVENDAY
    ) {
      for (const calibrationInjection of payload.calibrationInjectionData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.calInjWorkspaceService.import(
                createdTestSummary.id,
                calibrationInjection,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.onlineOfflineCalibrationData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.ONOFF
    ) {
      for (const onlineOfflineCalibration of payload.onlineOfflineCalibrationData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.onlineOfflineCalibrationWorkspaceService.import(
                createdTestSummary.id,
                onlineOfflineCalibration,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async createTestSummary(
    locationId: string,
    payload: TestSummaryBaseDTO,
    userId: string,
    historicalrecordId?: string,
  ): Promise<TestSummaryRecordDTO> {
    const timestamp = currentDateTime();
    const [
      reportPeriodId,
      componentRecordId,
      monitorSystemRecordId,
    ] = await this.lookupValues(locationId, payload);
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
      id: historicalrecordId ? historicalrecordId : uuid(),
      locationId,
      monitorSystemRecordId,
      componentRecordId,
      reportPeriodId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
      lastUpdated: timestamp,
      needsEvalFlag: 'Y',
      updatedStatusFlag: 'Y',
      evalStatusCode: 'EVAL',
    });

    await this.repository.save(entity);
    const result = await this.repository.getTestSummaryById(entity.id);

    const dto = await this.map.one(result);

    delete dto.calibrationInjectionData;
    delete dto.linearitySummaryData;
    delete dto.rataData;
    delete dto.flowToLoadReferenceData;
    delete dto.flowToLoadCheckData;
    delete dto.cycleTimeSummaryData;
    delete dto.onlineOfflineCalibrationData;
    delete dto.fuelFlowmeterAccuracyData;
    delete dto.transmitterTransducerData;
    delete dto.fuelFlowToLoadBaselineData;
    delete dto.fuelFlowToLoadTestData;
    delete dto.appECorrelationTestSummaryData;
    delete dto.unitDefaultTestData;
    delete dto.hgSummaryData;
    delete dto.testQualificationData;
    delete dto.protocolGasData;
    delete dto.airEmissionTestingData;

    return dto;
  }

  async updateTestSummary(
    locationId: string,
    id: string,
    payload: TestSummaryBaseDTO,
    userId: string,
  ): Promise<TestSummaryRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.getTestSummaryById(id);

    if (!entity) {
      throw new LoggingException(
        `A test summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [
      reportPeriodId,
      componentRecordId,
      monitorSystemRecordId,
    ] = await this.lookupValues(locationId, payload);

    entity.beginDate = payload.beginDate;
    entity.beginHour = payload.beginHour;
    entity.beginMinute = payload.beginMinute;
    entity.endDate = payload.endDate;
    entity.endHour = payload.endHour;
    entity.endMinute = payload.endMinute;
    entity.componentRecordId = componentRecordId;
    entity.gracePeriodIndicator = payload.gracePeriodIndicator;
    entity.injectionProtocolCode = payload.injectionProtocolCode;
    entity.monitorSystemRecordId = monitorSystemRecordId;
    entity.reportPeriodId = reportPeriodId;
    entity.spanScaleCode = payload.spanScaleCode;
    entity.testComment = payload.testComment;
    entity.testDescription = payload.testDescription;
    entity.testNumber = payload.testNumber;
    entity.testReasonCode = payload.testReasonCode;
    entity.testResultCode = payload.testResultCode;
    entity.testTypeCode = payload.testTypeCode;
    entity.userId = userId;
    entity.lastUpdated = timestamp;
    entity.updateDate = timestamp;
    entity.needsEvalFlag = 'Y';
    entity.updatedStatusFlag = 'Y';
    entity.evalStatusCode = 'EVAL';

    await this.repository.save(entity);
    return this.map.one(entity);
  }

  async deleteTestSummary(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException(
        `Error deleting Test Summary record Id [${id}]`,
        e.message,
      );
    }
  }

  async resetToNeedsEvaluation(
    testSumId: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    if (!isImport) {
      const timestamp = currentDateTime();
      const entity = await this.repository.findOne(testSumId);

      entity.userId = userId;
      entity.updateDate = timestamp;
      entity.lastUpdated = timestamp;
      entity.needsEvalFlag = 'Y';
      entity.updatedStatusFlag = 'Y';
      entity.evalStatusCode = 'EVAL';

      await this.repository.save(entity);
    }
  }

  async lookupValues(locationId: string, payload: TestSummaryBaseDTO) {
    let reportPeriodId = null;
    let componentRecordId = null;
    let monitorSystemRecordId = null;

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

      monitorSystemRecordId = monitorSystem ? monitorSystem.id : null;
    }

    return [reportPeriodId, componentRecordId, monitorSystemRecordId];
  }
}
